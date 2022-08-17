import { App } from "aws-cdk-lib";
import { VaultTransactionIndexerStack } from "./src/stack";
import {
    DEVNET_PARITY_VAULTS,
    DEVNET_STAGING_VAULTS,
    MAINNET_VAULTS,
} from "@castlefinance/vault-core";

// // // //

// Define env var references
const GITHUB_REF_NAME: string = String(process.env.GITHUB_REF_NAME) || "";

// Defines constants for creating stacks
const MAIN_BRANCH: string = "main";
const PROD_POSTFIX: string = "-PROD";
const STAGING_POSTFIX: string = "-STAGING";

// // // //

// Defines new CDK App
const app = new App();

// Determine if we're deploying to production or not
const isProdDeploy: boolean = GITHUB_REF_NAME === MAIN_BRANCH ? true : false;

// Add environment postfix to CDK stack ID
const STACK_POSTFIX = isProdDeploy ? PROD_POSTFIX : STAGING_POSTFIX;

// Define the VaultConfigs to provision stacks for
const vaults = isProdDeploy
    ? [...MAINNET_VAULTS, ...DEVNET_PARITY_VAULTS]
    : DEVNET_STAGING_VAULTS;

// Create a VaultTransactionIndexerStack for each VaultConfig
vaults.forEach((v) => {
    new VaultTransactionIndexerStack(
        app,
        `VaultTxIndxr-${v.vault_id}-${STACK_POSTFIX}`,
        v
    );
});

// Synthesize all Cloudformation Stacks
app.synth();
