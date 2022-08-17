/**
 * filterTransactions
 * Accepts a txHash and array of ordered transaction hashes,
 * and slices the array at the index of the transaction
 */
export function filterTransactions(props: {
    txHashToSlice: string;
    txHashes: string[];
}): string[] {
    const { txHashToSlice, txHashes } = props;

    // Get index of newest transaction
    const txIndex = txHashes.indexOf(txHashToSlice);

    // Slice TXs up to the the newest transaction and return
    return txHashes.slice(0, txIndex);
}
