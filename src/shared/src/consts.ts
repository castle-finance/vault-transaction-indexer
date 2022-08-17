// Export constants used throughout DynamoDB tables + lambdas
export const VAULT_ID_PARTITION_KEY: string = "vaultID";
export const TX_HASH_PARTITION_KEY: string = "txHash";
export const BLOCKTIME_PARTITION_KEY: string = "blockTime";

// Export SNS subject for intake queue
export const INTAKE_SNS_SUBJECT = "incoming-transaction";
