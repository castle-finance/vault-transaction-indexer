import { Cluster } from "@castlefinance/vault-core";

// // // //

/**
 * Environment variables for the lambda
 */
export interface EnvironmentVariables {
    VAULT_ID: string;
    CLUSTER: Cluster;
    RAW_TRANSACTIONS_TABLE_NAME: string;
}
