import * as AWS from "aws-sdk";
const sns = new AWS.SNS();
const db = new AWS.DynamoDB.DocumentClient();
import { addTxsToIntakeQueue } from "./lib/addTxsToIntakeQueue";
import { getEnv, RawTransaction } from "transaction-indexer-lib";
import { getMissingTransactions } from "./lib/getMissingTransactions";
import { fetchTransactionsFromSolscan } from "./lib/fetchTransactionsFromSolscan";
import { filterTransactions } from "./lib/filterTransactions";
import { fetchTransactionFromDynamo } from "./lib/fetchTransactionFromDynamo";
import { Cluster } from "@castlefinance/vault-core";

// // // //

/**
 * Define handler for index-raw-transactions lambda
 * This lambda is triggered by an AWS event rule that's automatically triggered on an interval
 */
export const handler = async (
    _event: any = {},
    context: any = {}
): Promise<any> => {
    // Log start message
    console.log("index-raw-transactions -> start");

    // Define references to environment vars from process.env
    const VAULT_ID = getEnv({ key: "VAULT_ID" });
    const CLUSTER = getEnv({ key: "CLUSTER" }) as Cluster; // Coerce to use "Cluster" type
    const SNS_ARN = getEnv({ key: "SNS_ARN" });
    const TABLE_NAME = getEnv({ key: "RAW_TRANSACTIONS_TABLE_NAME" });

    // Wrap async/await invocations in try-catch
    try {
        // Fetch latestTransactionEvents from SolScan
        const latestTransactionEvents: RawTransaction[] =
            await fetchTransactionsFromSolscan({
                vaultID: VAULT_ID,
                cluster: CLUSTER,
            });

        // Define array of transaction hashes for latestTransactionEvents
        const latestTransactionHashes: string[] = latestTransactionEvents.map(
            (t) => t.txHash
        );

        // Get the earliest raw transaction in the database
        const earliestTransactionInDB = await fetchTransactionFromDynamo({
            db,
            tableName: TABLE_NAME,
            vaultID: VAULT_ID,
            blockTimeSort: "asc",
        });

        // If there are no transactions -> queue up 10 newest
        // transactions to be downloaded into DB and close the lambda
        if (earliestTransactionInDB === null) {
            console.log("No transactions found - queue up 10 newest TXs.");
            await addTxsToIntakeQueue({
                sns,
                snsArn: SNS_ARN,
                transactions: latestTransactionHashes,
            });
            return;
        }

        // Log earliestTransactionInDB data
        console.log("earliestTransactionInDB");
        console.log(JSON.stringify(earliestTransactionInDB, null, 4));

        // Fetch transactions that are before earliestTransactionInDB
        const earlierTransactionEvents: RawTransaction[] =
            await fetchTransactionsFromSolscan({
                vaultID: VAULT_ID,
                cluster: CLUSTER,
                beforeTransactionHash: earliestTransactionInDB.txHash,
            });

        // Queue up earlier transactions if they're available
        // This backfill continues until *all* transactions are stored in DynamoDB
        if (earlierTransactionEvents.length !== 0) {
            await addTxsToIntakeQueue({
                sns,
                snsArn: SNS_ARN,
                transactions: earlierTransactionEvents.map((t) => t.txHash),
            });
            return;
        }

        // Log "Backfill is complete" message
        console.log("----- BACKFILL IS COMPLETE -----");

        // // // //

        // Log "Syncing new transactions" message
        console.log("----- SYNCING NEW TRANSACTIONS -----");

        // Get single **newest** transaction from DynamoDB
        const newestTransactionInDB = await fetchTransactionFromDynamo({
            db,
            tableName: TABLE_NAME,
            vaultID: VAULT_ID,
            blockTimeSort: "desc",
        });

        // Short-circuit execution if no transactions are found in database
        if (newestTransactionInDB === null) {
            throw new Error("No newest transaction found in DynamoDB");
        }

        // Log newestTransactionInDB data
        console.log("newestTransactionInDB");
        console.log(JSON.stringify(newestTransactionInDB, null, 4));

        // If the latest transactions include the newest transaction
        // in DynamoDB, we only have to ingest the transactions that came after newestTransactionInDB
        if (latestTransactionHashes.includes(newestTransactionInDB.txHash)) {
            // Get transactions upto the newestTransactionInDB
            const txToSendToSqs: string[] = filterTransactions({
                txHashToSlice: newestTransactionInDB.txHash,
                txHashes: latestTransactionHashes,
            });

            // Shut down if there are no new transactions to sync
            if (txToSendToSqs.length === 0) {
                console.log("Transactions are up to date - shutting down.");
                return;
            }

            // Send missing transactions to SQS
            console.log("Ingesting latest transactions to SQS");

            // Add transactions to intake queue
            await addTxsToIntakeQueue({
                sns,
                snsArn: SNS_ARN,
                transactions: txToSendToSqs,
            });
            return;
        }

        // If latest transaction is *not* in the first page of API results,
        // fetch pages until the latest transaction is found, and add results to intake queue
        // Recursive page fetching is handled in getMissingTransactions
        const missingTransactionHashes = await getMissingTransactions({
            vaultID: VAULT_ID,
            cluster: CLUSTER,
            newestTransactionHash: newestTransactionInDB.txHash,
            startingMissingTransactionHashes: latestTransactionHashes,
        });

        // Log missing transaction hashes
        console.log("Found missing missing transaction hashes:");
        console.log(missingTransactionHashes);

        // Add filtered transaction hashes to intake queue
        await addTxsToIntakeQueue({
            sns,
            snsArn: SNS_ARN,
            transactions: filterTransactions({
                txHashToSlice: newestTransactionInDB.txHash,
                txHashes: missingTransactionHashes,
            }),
        });

        // Log "Done" message
        console.log("index-raw-transactions -> done.");
    } catch (error) {
        // Handle lambda errors here
        console.log("index-raw-transactions -> try/catch -> error");
        console.log(error);
        return context.fail(error);
    } finally {
        // Recover from errors here
        console.log("index-raw-transactions -> try/catch -> finally");
    }

    // Logs "shutdown" statement
    console.log("index-raw-transactions -> shutdown");
    return context.succeed();
};
