import { Cluster, Clusters } from "@castlefinance/vault-core";
import * as AWS from "aws-sdk";
const db = new AWS.DynamoDB.DocumentClient();
import {
    RawTransaction,
    getEnv,
    fetchJson,
    INTAKE_SNS_SUBJECT,
    VAULT_ID_PARTITION_KEY,
    TX_HASH_PARTITION_KEY,
    BLOCKTIME_PARTITION_KEY,
} from "transaction-indexer-lib";

// // // //

// Example event param:
// NOTE - body is a stringified JSON object that must be parsed in the lambda
// {
//   "Records": [
//       {
//           "messageId": "000e55cf-4ef5-4a7d-9337-3d0ad70ec8d2",
//           "receiptHandle": "AQEBipQkelewWu3/u27i/XK/A3CmMOh9pCAd75ZTepeo7Am4mPWfLe4qdw6ofmpaIkK3sHXWwmMelFgLW8Y3gif2Ij8fx33/DIIGBW/Hrk1VsALT2fdoEc+MCAmbNz0aQ2gayAOf0oEQhxpL1G5BDaUVH492OF8Qzd8NT2BLK/WMSb1z6qf785Tv/GIx93Or2R9hKCOw6ZW56Jez1UV47LgC0Ul0fd1OiFeAYEuBubnRdmGJFblFeo3MW2MLGPTlbRTD7xd8sQ3uhmZnep76aYptKw28bOxPbFI+FiyUnniT5k5lL2jK51qU+l/wredSqBGeHVNbRBcQxUrzlusWhHEqc8a6bazwQ3f1luX8lVbagVgdEbnPBgTc9y8lbWM/oNg07vbW4Uw0VllbMI1yoaI9mHfTh51O8fxhyHr21K/tzA2OR1mSemEntrAS/93oRvUsjdExtyxwbximQUZ74tG+oev05+scbAL7ux6kIcsDttY=",
//           "body": "{\n  \"Type\" : \"Notification\",\n  \"MessageId\" : \"24a25fc7-f93b-57e9-a33c-04a2b1acc496\",\n  \"TopicArn\" : \"arn:aws:sns:us-east-1:410462221023:VaultTransactionIndexerStack-STAGING-vaulttxincomingtopicsolmaxyieldproofcheckeralloccap60devnetstagingv20D51D603-HJJHSCDVEP2Q\",\n  \"Subject\" : \"incoming-transaction\",\n  \"Message\" : \"4hrtCR3uZJKvbF4oJ52A1irRtkSvuCvcRohiogZ9ScHtzzef583o9h1oyPQSv4GdwppdW9oxdC2cAwLfY6akeqsW\",\n  \"Timestamp\" : \"2022-08-04T04:08:55.651Z\",\n  \"SignatureVersion\" : \"1\",\n  \"Signature\" : \"sxKx9+iVLBigRo4o8LcVgSO7E/Hqb4DZzEjbfGFAnW0grJTUknNLhq/UX8+2I+En2uUS1RFz/yguNj4yuiIGnTN7eJhPYsXcdygRmz9QMGzKVvWiAICb8Un3ugEMbOxWwxrRQozqzRbn0vBtrTPcv0fmELty0HYEsRiIMZ+qMJ79WJOQHq1cUAzm0L2i8RzY40/3VvQyJZbbTPvPj/F5D1SVtqVihPNgVILNUxglox3uI6d/qsbOGBEHtJfCvRoBLXP4sAst8VFffE7klH1ISncGywXEXHw6YuwUloDiOzmmLTgS1HAqao57dzmUT7uAAQ1SA3gnnUJlLXd0I+WyIQ==\",\n  \"SigningCertURL\" : \"https://sns.us-east-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem\",\n  \"UnsubscribeURL\" : \"https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:410462221023:VaultTransactionIndexerStack-STAGING-vaulttxincomingtopicsolmaxyieldproofcheckeralloccap60devnetstagingv20D51D603-HJJHSCDVEP2Q:9d976e0e-400e-40ca-bc43-a487fc2a97c2\"\n}",
//           "attributes": {
//               "ApproximateReceiveCount": "1",
//               "SentTimestamp": "1659586135692",
//               "SenderId": "AIDAIT2UOQQY3AUEKVGXU",
//               "ApproximateFirstReceiveTimestamp": "1659586135738"
//           },
//           "messageAttributes": {},
//           "md5OfMessageAttributes": null,
//           "md5OfBody": "c8d1c917af12edf68dbadf576e42fe41",
//           "eventSource": "aws:sqs",
//           "eventSourceARN": "arn:aws:sqs:us-east-1:410462221023:VaultTransactionIndexerStack-STAG-vaulttxincomingqueuesolmaxyieldpr-G6LY9338mOdz",
//           "awsRegion": "us-east-1"
//       }
//   ]
// }

// // // //

/**
 * Define handler for download-raw-transaction lambda
 */
export const handler = async (
    event: any = {},
    context: any = {}
): Promise<any> => {
    // Log start message
    console.log("download-raw-transaction -> start");
    console.log(JSON.stringify(event, null, 4));

    // Define references to environment vars from process.env
    const TABLE_NAME = getEnv({ key: "RAW_TRANSACTIONS_TABLE_NAME" });
    const VAULT_ID = getEnv({ key: "VAULT_ID" });
    const CLUSTER = getEnv({ key: "CLUSTER" }) as Cluster;

    // Wrap async/await invocations in try-catch
    try {
        // Short-circuit if event.records isn't defined
        if (!event.Records) {
            throw new Error(
                "event.Records not defined on lambda event parameter."
            );
        }

        // Pull reference to a single record
        const record = event.Records[0] || null;

        // Short-circuit if record isn't defined
        if (!record) {
            throw new Error("Record not found in lambda event parameter.");
        }

        // Parse body from record
        const body = JSON.parse(record.body);

        // Pull "Subject" and "Message" from record.body
        const subject = body.Subject || null;
        const message = body.Message || null;

        // Log subject and message
        console.log(`subject: ${subject}`);
        console.log(`message: ${message}`);

        // Short-circuit if subject is falsey
        if (!subject) {
            throw new Error(
                `SNS subject not found. Should be "${INTAKE_SNS_SUBJECT}"`
            );
        }
        // Short-circuit if message is falsey
        if (!message) {
            throw new Error(
                "SNS message not found - should be a valid transaction hash"
            );
        }

        // Short-circuit if subject isn't equal to INTAKE_SNS_SUBJECT
        if (subject !== INTAKE_SNS_SUBJECT) {
            throw new Error(
                `Received invalid SNS subject: "${subject}". Should be "${INTAKE_SNS_SUBJECT}"`
            );
        }

        // Build URL to fetch TX raw transaction
        let url = `https://api.solscan.io/transaction?tx=${message}`;

        // Add cluster parameter to URL
        if (CLUSTER === Clusters.mainnetBeta) {
            url = `${url}&cluster=https://ssc-dao.genesysgo.net/`;
        } else {
            url = `${url}&cluster=devnet`;
        }

        // Log URL
        console.log(`Solscan URL: ${url}`);

        // Fetch rawTransaction from Solscan
        const rawTransaction = await fetchJson<RawTransaction>(url);

        // Log rawTransaction JSON
        console.log("rawTransaction");
        console.log(JSON.stringify(rawTransaction, null, 4));

        // Pull values for blockTime + txHash from rawTransaction
        const { blockTime, txHash } = rawTransaction;

        // Log blockTime and txHash
        console.log(`blockTime: ${blockTime}`);
        console.log(`txHash: ${txHash}`);

        // Defines the params for db.put
        const putItemInput: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: TABLE_NAME,
            Item: {
                [VAULT_ID_PARTITION_KEY]: VAULT_ID,
                [TX_HASH_PARTITION_KEY]: txHash,
                [BLOCKTIME_PARTITION_KEY]: blockTime,
                raw: rawTransaction,
            },
        };

        // Inserts the record into the DynamoDB table
        await db.put(putItemInput).promise();

        // Log "done" statement
        console.log("Inserted raw transaction into DynamoDB -> done.");
    } catch (error) {
        // Handle lambda errors here
        console.log("download-raw-transaction -> try/catch -> error");
        return context.fail(error);
    } finally {
        // Recover from errors here
        console.log("download-raw-transaction -> try/catch -> finally");
    }

    // Logs "shutdown" statement
    console.log("download-raw-transaction -> shutdown");
    return context.succeed();
};
