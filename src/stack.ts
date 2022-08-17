import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as events from "aws-cdk-lib/aws-events";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { EnvironmentVariables as DownloadRawTransactionLambdaEnvVars } from "./lambdas/download-raw-transaction/types";
import { EnvironmentVariables as NormalizeRawTransactionLambdaEnvVars } from "./lambdas/normalize-raw-transaction/types";
import { EnvironmentVariables as IndexTransactionIDsLambdaEnvVars } from "./lambdas/index-transaction-ids/types";
import { DeploymentEnvs, VaultConfig } from "@castlefinance/vault-core";
import { Construct } from "constructs";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import {
    BLOCKTIME_PARTITION_KEY,
    TX_HASH_PARTITION_KEY,
    VAULT_ID_PARTITION_KEY,
} from "./shared";

// // // //

/**
 * Defines the Transaction Indexer CDK stack for a single VaultConfig
 */
export class VaultTransactionIndexerStack extends cdk.Stack {
    constructor(
        scope: Construct,
        id: string,
        vaultConfig: VaultConfig<DeploymentEnvs>
    ) {
        super(scope, id);

        // Sanitize vault name
        // Use the first 8 characters of the vaultID since it's easier to read
        // Fun fact - there's only a one-in-218-trillion chance using this 8-character substring will cause a collision with another vault in the future!
        const truncatedVaultName = vaultConfig.vault_id.slice(0, 8);

        // Defines names for queues + topics + lambdas + event rule (must be unique)
        const downloadRawTxQueueName: string = `vault-${truncatedVaultName}-download-raw-tx-queue`;
        const downloadRawTxDeadLetterQueueName: string = `vault-${truncatedVaultName}-download-raw-tx-dead-letter-queue`;
        const downloadRawTxTopicName: string = `vault-${truncatedVaultName}-download-raw-tx-topic`;
        const downloadRawTxLambdaName: string = `vault-${truncatedVaultName}-download-raw-tx-lambda`;
        const indexRawTxIDsLambdaName: string = `vault-${truncatedVaultName}-index-raw-tx-ids`;
        const rawTransactionsTableName: string = `vault-${truncatedVaultName}-transactions-raw`;
        const normalizeRawTransactionLambdaName: string = `vault-${truncatedVaultName}-normalize-raw-tx-lambda`;
        const normalizedTransactionsTableName: string = `vault-${truncatedVaultName}-transactions-normalized`;

        // Define downloadRawTxDeadLetterQueue - stores incoming TX hashes whose fetch request failed
        const downloadRawTxDeadLetterQueue = new sqs.Queue(
            this,
            downloadRawTxDeadLetterQueueName,
            {
                retentionPeriod: cdk.Duration.minutes(30),
            }
        );

        // Define downloadRawTxQueue - stores incoming TX hashes that need to be indexed + stored
        // Wires up dead letter queue as fallback for downloadRawTxQueue
        const downloadRawTxQueue = new sqs.Queue(this, downloadRawTxQueueName, {
            deadLetterQueue: {
                queue: downloadRawTxDeadLetterQueue,
                maxReceiveCount: 1,
            },
        });

        // Define downloadRawTxTopic - SNS topic for publishing TX hashes to be added to the queue above
        const downloadRawTxTopic = new sns.Topic(this, downloadRawTxTopicName);

        // Subscribe downloadRawTxQueue to the downloadRawTxTopic
        downloadRawTxTopic.addSubscription(
            new subs.SqsSubscription(downloadRawTxQueue)
        );

        // // // //
        // DynamoDB - rawTransactionsTable
        // Stores all the raw transactions as JSON for a single Vault
        const rawTransactionsTable = new dynamodb.Table(
            this,
            rawTransactionsTableName,
            {
                partitionKey: {
                    name: VAULT_ID_PARTITION_KEY,
                    type: dynamodb.AttributeType.STRING,
                },
                sortKey: {
                    name: BLOCKTIME_PARTITION_KEY,
                    type: dynamodb.AttributeType.NUMBER,
                },
                stream: dynamodb.StreamViewType.NEW_IMAGE,
                tableName: rawTransactionsTableName,
                removalPolicy: RemovalPolicy.DESTROY, // NOTE - This removalPolicy is NOT recommended for production code
            }
        );
        rawTransactionsTable.addGlobalSecondaryIndex({
            indexName: BLOCKTIME_PARTITION_KEY,
            partitionKey: {
                name: BLOCKTIME_PARTITION_KEY,
                type: dynamodb.AttributeType.NUMBER,
            },
        });

        // // // //
        // DynamoDB - normalizedTransactionsTable
        // Stores all the raw transactions as JSON for a single Vault
        const normalizedTransactionsTable = new dynamodb.Table(
            this,
            normalizedTransactionsTableName,
            {
                partitionKey: {
                    name: TX_HASH_PARTITION_KEY,
                    type: dynamodb.AttributeType.STRING,
                },
                sortKey: {
                    name: BLOCKTIME_PARTITION_KEY,
                    type: dynamodb.AttributeType.NUMBER,
                },
                stream: dynamodb.StreamViewType.NEW_IMAGE,
                tableName: normalizedTransactionsTableName,
                removalPolicy: RemovalPolicy.DESTROY, // NOTE - This removalPolicy is NOT recommended for production code
            }
        );

        // // // //
        // Lambda - indexTransactionIDs
        // Indexes all vault transactionIDs from Solscan API
        // Defines the indexTransactionIDs lambda
        const indexTransactionIDsLambdaEnv: IndexTransactionIDsLambdaEnvVars = {
            VAULT_ID: vaultConfig.vault_id,
            CLUSTER: vaultConfig.cluster,
            SNS_ARN: downloadRawTxTopic.topicArn,
            RAW_TRANSACTIONS_TABLE_NAME: rawTransactionsTable.tableName,
        };
        const indexTransactionIDsLambda = new lambda.Function(
            this,
            indexRawTxIDsLambdaName,
            {
                code: new lambda.AssetCode("src/lambdas/index-transaction-ids"),
                handler: "lambda.handler",
                runtime: lambda.Runtime.NODEJS_14_X,
                timeout: cdk.Duration.seconds(300),
                tracing: lambda.Tracing.ACTIVE,
                environment: { ...indexTransactionIDsLambdaEnv },
            }
        );

        // Adds permissions for the indexTransactionIDsLambda to read/write from rawTransactionsTable
        rawTransactionsTable.grantReadData(indexTransactionIDsLambda);

        // Run indexTransactionIDsLambda every 3 minutes
        // See https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
        const rule = new events.Rule(this, "Rule", {
            schedule: events.Schedule.expression("rate(3 minutes)"),
        });

        // Adds indexTransactionIDsLambda as target for scheduled rule
        rule.addTarget(new targets.LambdaFunction(indexTransactionIDsLambda));

        // // // //
        // Lambda - downloadRawTransaction
        // Pulls down a single transaction as JSON and stores in DynamoDB
        // for later processing. This step ensures that we maintain
        // a copy of all vault transactions so we don't have to depend on external APIs.

        // Defines the downloadRawTransaction lambda
        const downloadRawTransactionLambdaEnv: DownloadRawTransactionLambdaEnvVars =
            {
                VAULT_ID: vaultConfig.vault_id,
                CLUSTER: vaultConfig.cluster,
                RAW_TRANSACTIONS_TABLE_NAME: rawTransactionsTable.tableName,
            };
        const downloadRawTransactionLambda = new lambda.Function(
            this,
            downloadRawTxLambdaName,
            {
                code: new lambda.AssetCode(
                    "src/lambdas/download-raw-transaction"
                ),
                handler: "lambda.handler",
                runtime: lambda.Runtime.NODEJS_14_X,
                timeout: cdk.Duration.seconds(15),
                tracing: lambda.Tracing.ACTIVE,
                environment: { ...downloadRawTransactionLambdaEnv },
            }
        );

        // Adds permissions for the downloadRawTransactionLambda to read/write from rawTransactionsTable
        rawTransactionsTable.grantReadWriteData(downloadRawTransactionLambda);

        // Add SQS queue as event source for downloadRawTransaction lambda
        downloadRawTransactionLambda.addEventSource(
            new SqsEventSource(downloadRawTxQueue, {
                batchSize: 1,
                maxBatchingWindow: Duration.seconds(15),
            })
        );

        // Add dead letter SQS queue as event source for downloadRawTransaction lambda
        downloadRawTransactionLambda.addEventSource(
            new SqsEventSource(downloadRawTxDeadLetterQueue, {
                batchSize: 1,
                maxBatchingWindow: Duration.seconds(15),
            })
        );

        // // // //
        // Lambda - normalizeRawTransaction
        // Pulls down a single transaction as JSON and stores in DynamoDB
        // for later processing. This step ensures that we maintain
        // a copy of all vault transactions so we don't have to depend on external APIs.

        // Defines the normalizeRawTransaction lambda
        const normalizeRawTransactionLambdaEnv: NormalizeRawTransactionLambdaEnvVars =
            {
                NORMALIZED_TRANSACTIONS_TABLE_NAME:
                    normalizedTransactionsTable.tableName,
            };
        const normalizeRawTransactionLambda = new lambda.Function(
            this,
            normalizeRawTransactionLambdaName,
            {
                code: new lambda.AssetCode(
                    "src/lambdas/normalize-raw-transaction"
                ),
                handler: "lambda.handler",
                runtime: lambda.Runtime.NODEJS_14_X,
                timeout: cdk.Duration.seconds(15),
                tracing: lambda.Tracing.ACTIVE,
                environment: {
                    ...normalizeRawTransactionLambdaEnv,
                },
            }
        );

        // Adds permissions for the normalizeRawTransactionLambda to read/write from normalizedTransactionsTable
        normalizedTransactionsTable.grantReadWriteData(
            normalizeRawTransactionLambda
        );

        // Add DynamoDB stream event source to rawTransactionsTable
        // This runs the `normalizeRawTransactionLambda` lambda anytime a raw transaction is downloaded
        normalizeRawTransactionLambda.addEventSource(
            new DynamoEventSource(rawTransactionsTable, {
                startingPosition: lambda.StartingPosition.LATEST,
                batchSize: 1,
            })
        );

        // // // //

        // ENHANCEMENT - get Datadog working with CDK@V2
        // Initialize Datadog CDK constructs IFF DATADOG_API_KEY is present
        // if (process.env.DATADOG_API_KEY) {
        //   // Pull DATADOG_API_KEY from process.env
        //   const DATADOG_API_KEY: string = String(process.env.DATADOG_API_KEY);

        //   // Initialize Datadog CDK construct
        //   const datadog = new Datadog(this, "Datadog", {
        //     apiKey: DATADOG_API_KEY,
        //     addLayers: true,
        //     logLevel: "debug",
        //     nodeLayerVersion: 74,
        //     extensionLayerVersion: 21,
        //     flushMetricsToLogs: true,
        //   });

        //   // Wires up all lambdas to Datadog
        //   datadog.addLambdaFunctions(lambdaFunctions);
        // }
    }
}
