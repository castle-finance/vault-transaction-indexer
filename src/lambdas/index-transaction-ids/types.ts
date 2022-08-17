import { Cluster } from "@castlefinance/vault-core";

// // // //

/**
 * Environment variables for the lambda
 */
export interface EnvironmentVariables {
    VAULT_ID: string;
    CLUSTER: Cluster;
    SNS_ARN: string;
    RAW_TRANSACTIONS_TABLE_NAME: string;
}
