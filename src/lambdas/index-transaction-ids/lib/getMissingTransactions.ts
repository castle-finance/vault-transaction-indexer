import { fetchTransactionsFromSolscan } from "./fetchTransactionsFromSolscan";
import { RawTransaction } from "transaction-indexer-lib";
import { Cluster } from "@castlefinance/vault-core";

// // // //

/**
 * getMissingTransactions
 * Fetching transactions that have been executed against a vault,
 * but only since the most recent raw transaction stored in DynamoDB.
 * This is used for syncing the latest transactions, not for backfilling old ones.
 */
export async function getMissingTransactions(props: {
    vaultID: string;
    cluster: Cluster;
    newestTransactionHash: string;
    startingMissingTransactionHashes: string[];
}): Promise<string[]> {
    const {
        vaultID,
        cluster,
        newestTransactionHash,
        startingMissingTransactionHashes,
    } = props;

    // Array to store missing transaction hashes
    let missingTransactionHashes: string[] = [
        ...startingMissingTransactionHashes,
    ];

    // Store running list of transactions
    // let allTransactions: RawTransaction[] = [];
    let perPageReponse: RawTransaction[] = [];
    let foundLastTransaction: boolean = false;

    try {
        // While latest number of users isn't zero, continue fetching
        while (!foundLastTransaction) {
            // Fetch single page of results
            perPageReponse = await fetchTransactionsFromSolscan({
                vaultID,
                cluster,
                beforeTransactionHash:
                    missingTransactionHashes[
                        missingTransactionHashes.length - 1
                    ],
            });

            // Update running total of transaction w/ perPageResponse
            missingTransactionHashes = [
                ...missingTransactionHashes,
                ...perPageReponse.map((t) => t.txHash),
            ];

            // Update foundLastTransaction state
            foundLastTransaction = missingTransactionHashes.includes(
                newestTransactionHash
            );
        }

        // Return all missing transaction hashes
        return missingTransactionHashes;
    } catch (e) {
        // Catch error
        console.log("ERROR!");
        console.log(e);
        return [];
    }
}
