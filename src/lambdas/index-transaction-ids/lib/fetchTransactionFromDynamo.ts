import * as AWS from "aws-sdk";
import {
    BLOCKTIME_PARTITION_KEY,
    TX_HASH_PARTITION_KEY,
    VAULT_ID_PARTITION_KEY,
} from "transaction-indexer-lib";

// // // //

interface RawTransactionMetadata {
    blockTime: number;
    txHash: string;
    vaultID: string;
}

/**
 * fetchTransactionFromDynamo
 * Fetch a single raw transaction from DyanmoDB
 */
export async function fetchTransactionFromDynamo(props: {
    db: AWS.DynamoDB.DocumentClient;
    tableName: string;
    vaultID: string;
    blockTimeSort: "asc" | "desc";
}): Promise<RawTransactionMetadata | null> {
    const { db, tableName, vaultID, blockTimeSort } = props;

    // Get the a single raw transaction from DynamoDB
    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        Limit: 1,
        ExpressionAttributeValues: {
            ":vaultID": vaultID,
        },
        ProjectionExpression: `${VAULT_ID_PARTITION_KEY}, ${TX_HASH_PARTITION_KEY}, ${BLOCKTIME_PARTITION_KEY}`,
        KeyConditionExpression: `${VAULT_ID_PARTITION_KEY} = :vaultID`,
        ScanIndexForward: blockTimeSort === "asc", // true = ascending, false = descending
    };

    // Send query to DynamoDB
    const queryOutput: AWS.DynamoDB.DocumentClient.QueryOutput = await db
        .query(queryParams)
        .promise();

    // Ensure queryOutput.Items is defined => return null if not.
    if (!queryOutput?.Items || !queryOutput?.Items[0]) {
        return null;
    }

    // Return RawTransactionMetadata
    return queryOutput.Items[0] as RawTransactionMetadata;
}
