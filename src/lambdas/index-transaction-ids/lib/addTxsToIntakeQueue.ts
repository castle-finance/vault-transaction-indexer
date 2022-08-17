import * as AWS from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { INTAKE_SNS_SUBJECT } from "transaction-indexer-lib";

// // // //

/**
 * Type-union to describe the result from a single sns.publish(...) invocation
 */
type PublishResult = PromiseResult<AWS.SNS.PublishResponse, AWS.AWSError>;

/**
 * addTxsToIntakeQueue
 * Publishes an SNS event to queue-up several transactions to be downloaded to DynamoDB
 */
export function addTxsToIntakeQueue(props: {
    transactions: string[];
    snsArn: string;
    sns: AWS.SNS;
}): Promise<PublishResult[]> {
    const { transactions, snsArn, sns } = props;

    // Wrap all sns.publish(...) invocations in Promise.all
    return Promise.all(
        transactions.map(async (txHash) => {
            // Log each txHash published to SNS topic
            console.log(`Publish txHash to SNS topic: ${txHash}`);

            // Defines params for sns.publish
            const params: AWS.SNS.PublishInput = {
                Message: txHash,
                Subject: INTAKE_SNS_SUBJECT,
                TopicArn: snsArn,
            };

            // Invoke sns.publish(...) and return a promise
            return sns.publish(params).promise();
        })
    );
}
