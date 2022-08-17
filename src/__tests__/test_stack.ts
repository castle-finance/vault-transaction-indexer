import { expect as expectCDK, countResources } from "@aws-cdk/assert";
import { DEVNET_STAGING_VAULTS } from "@castlefinance/vault-core";
import * as cdk from "aws-cdk-lib";
import { VaultTransactionIndexerStack } from "../stack";

// // // //

describe("VaultTransactionIndexerStack", () => {
    test("loads", () => {
        const app = new cdk.App();

        // Configures CDK stack
        const stack: cdk.Stack = new VaultTransactionIndexerStack(
            app,
            "VaultTransactionIndexerStack-Test",
            DEVNET_STAGING_VAULTS[0]
        );

        // Checks stack resource count
        expectCDK(stack).to(countResources("AWS::Events::Rule", 1));
        expectCDK(stack).to(countResources("AWS::IAM::Role", 3));
        expectCDK(stack).to(countResources("AWS::Lambda::Function", 3));
        expectCDK(stack).to(countResources("AWS::Lambda::Permission", 1));
        expectCDK(stack).to(countResources("AWS::DynamoDB::Table", 2));
    });
});
