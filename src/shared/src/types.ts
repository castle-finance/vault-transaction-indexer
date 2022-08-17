/**
 * RawTransaction
 * Transaction data return by SolScan API
 */
export interface RawTransaction {
    blockTime: number;
    slot: number;
    txHash: string;
    fee: number;
    status: string;
    lamport: number;
    signer: string[];
    logMessage: string[];
    inputAccount: Array<{
        account: string;
        signer: boolean;
        writable: boolean;
        preBalance: number;
        postBalance: number;
    }>;
    recentBlockhash: string;
    innerInstructions: any[];
    mainActions: [];
    tokenBalanes: Array<{
        account: string;
        owner: string;
        amount: any;
        token: any;
    }>;
    parsedInstruction: Array<{
        programId: string;
        program: string;
        type: string;
        data: string;
        dataEncode: string;
        name: string;
        params: any[];
    }>;
    txStatus: string;
    confirmations: null | any;
}
