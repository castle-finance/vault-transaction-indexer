import { Cluster, Clusters } from "@castlefinance/vault-core";
import { fetchJson, RawTransaction } from "transaction-indexer-lib";

// // // //

/**
 * fetchTransactionsFromSolscan
 * Fetch transactions for a specific vault from Solscan
 */
export async function fetchTransactionsFromSolscan(props: {
    vaultID: string;
    cluster: Cluster;
    beforeTransactionHash?: string;
}): Promise<RawTransaction[]> {
    const { vaultID, cluster, beforeTransactionHash } = props;
    // Define URL base
    let url = `https://api.solscan.io/account/transaction?address=${vaultID}`;

    // Add cluster parameter to URL
    if (cluster === Clusters.mainnetBeta) {
        url = `${url}&cluster=https://ssc-dao.genesysgo.net/`;
    } else {
        url = `${url}&cluster=devnet`;
    }

    // Add before parameter
    if (beforeTransactionHash) {
        url = `${url}&before=${beforeTransactionHash}`;
    }

    // Log URL
    console.log(`Solscan URL: ${url}`);

    // Fetch transactions from Solscan
    // NOTE - the `succcess` (with three "c" characters) is *not* a typo on our end.
    // The Solscan API is the original source of this typo - we have to work around it.
    const response = await fetchJson<{
        succcess: boolean;
        data: RawTransaction[];
    }>(url);

    // Throw error if response.succcess is falsey
    if (!response.succcess) {
        console.log("Solscan Response: ");
        console.log(JSON.stringify(response, null, 4));
        throw new Error("Failed to fetch transactions from Solscan");
    }

    // Return RawTransaction[] from API
    return response.data;
}
