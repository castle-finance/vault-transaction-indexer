import * as AWS from "aws-sdk";
import {
    RawTransaction,
    getEnv,
    TX_HASH_PARTITION_KEY,
} from "transaction-indexer-lib";
const db = new AWS.DynamoDB.DocumentClient();

// // // //
// Example event param:
// {
//   "Records": [
//       {
//           "eventID": "5eceab2a4ee7bcda7999f63f5e52301f",
//           "eventName": "INSERT",
//           "eventVersion": "1.1",
//           "eventSource": "aws:dynamodb",
//           "awsRegion": "us-east-1",
//           "dynamodb": {
//               "ApproximateCreationDateTime": 1659669209,
//               "Keys": {
//                   "blockTime": {
//                       "N": "1651802210"
//                   },
//                   "txHash": {
//                       "S": "4hrtCR3uZJKvbF4oJ52A1irRtkSvuCvcRohiogZ9ScHtzzef583o9h1oyPQSv4GdwppdW9oxdC2cAwLfY6akeqsW"
//                   }
//               },
//               "NewImage": {
//                   "raw": {
//                       "M": {
//                           "lamport": {
//                               "N": "0"
//                           },
//                           "fee": {
//                               "N": "10000"
//                           },
//                           "logMessage": {
//                               "L": [
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 invoke [1]"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 success"
//                                   },
//                                   {
//                                       "S": "Program Cast1eoVj8hwfKKRPji4cqX7WFgcnYz3um7TTgnaJKFn invoke [1]"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 success"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program log: Instruction: InitializeMint"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2344 of 182237 compute units"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 success"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program log: Instruction: InitializeAccount"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3297 of 167784 compute units"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 success"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program log: Instruction: InitializeAccount"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3272 of 153075 compute units"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 success"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program log: Instruction: InitializeAccount"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3272 of 139883 compute units"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 success"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program log: Instruction: InitializeAccount"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3297 of 126691 compute units"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success"
//                                   },
//                                   {
//                                       "S": "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program log: Create"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 invoke [3]"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 success"
//                                   },
//                                   {
//                                       "S": "Program log: Initialize the associated token account"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]"
//                                   },
//                                   {
//                                       "S": "Program log: Instruction: InitializeAccount3"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2604 of 86429 compute units"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success"
//                                   },
//                                   {
//                                       "S": "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 16894 of 100060 compute units"
//                                   },
//                                   {
//                                       "S": "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success"
//                                   },
//                                   {
//                                       "S": "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [2]"
//                                   },
//                                   {
//                                       "S": "Program log: Create"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 invoke [3]"
//                                   },
//                                   {
//                                       "S": "Program 11111111111111111111111111111111 success"
//                                   },
//                                   {
//                                       "S": "Program log: Initialize the associated token account"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]"
//                                   },
//                                   {
//                                       "S": "Program log: Instruction: InitializeAccount3"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2604 of 62161 compute units"
//                                   },
//                                   {
//                                       "S": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success"
//                                   },
//                                   {
//                                       "S": "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 16770 of 75704 compute units"
//                                   },
//                                   {
//                                       "S": "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success"
//                                   },
//                                   {
//                                       "S": "Program Cast1eoVj8hwfKKRPji4cqX7WFgcnYz3um7TTgnaJKFn consumed 147220 of 200000 compute units"
//                                   },
//                                   {
//                                       "S": "Program Cast1eoVj8hwfKKRPji4cqX7WFgcnYz3um7TTgnaJKFn success"
//                                   }
//                               ]
//                           },
//                           "slot": {
//                               "N": "132667646"
//                           },
//                           "confirmations": {
//                               "NULL": true
//                           },
//                           "txStatus": {
//                               "S": "finalized"
//                           },
//                           "innerInstructions": {
//                               "L": [
//                                   {
//                                       "M": {
//                                           "parsedInstructions": {
//                                               "L": [
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Create Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "system"
//                                                           },
//                                                           "type": {
//                                                               "S": "createAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "transferAmount(SOL)": {
//                                                                       "N": "0.0014616"
//                                                                   },
//                                                                   "newAccount": {
//                                                                       "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                                                   },
//                                                                   "source": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "programOwner": {
//                                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "11111111111111111111111111111111"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "initializeMint"
//                                                           },
//                                                           "program": {
//                                                               "S": "spl-token"
//                                                           },
//                                                           "type": {
//                                                               "S": "initializeMint"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "mint": {
//                                                                       "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                                                   },
//                                                                   "decimals": {
//                                                                       "N": "6"
//                                                                   },
//                                                                   "mintAuthority": {
//                                                                       "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                                                   },
//                                                                   "rentSysvar": {
//                                                                       "S": "SysvarRent111111111111111111111111111111111"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Create Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "system"
//                                                           },
//                                                           "type": {
//                                                               "S": "createAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "transferAmount(SOL)": {
//                                                                       "N": "0.00203928"
//                                                                   },
//                                                                   "newAccount": {
//                                                                       "S": "DzUzw5PyN9mXBHirtEn8GPAkFU1Y7seVaSr6MaWDUw9S"
//                                                                   },
//                                                                   "source": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "programOwner": {
//                                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "11111111111111111111111111111111"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Initialize Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "spl-token"
//                                                           },
//                                                           "type": {
//                                                               "S": "initializeAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "tokenAddress": {
//                                                                       "S": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
//                                                                   },
//                                                                   "owner": {
//                                                                       "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                                                   },
//                                                                   "initAcount": {
//                                                                       "S": "DzUzw5PyN9mXBHirtEn8GPAkFU1Y7seVaSr6MaWDUw9S"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Create Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "system"
//                                                           },
//                                                           "type": {
//                                                               "S": "createAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "transferAmount(SOL)": {
//                                                                       "N": "0.00203928"
//                                                                   },
//                                                                   "newAccount": {
//                                                                       "S": "E1fpumkQhJtSheP2oQYkABa99eoP1gMm5nRTVV7grWAL"
//                                                                   },
//                                                                   "source": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "programOwner": {
//                                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "11111111111111111111111111111111"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Initialize Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "spl-token"
//                                                           },
//                                                           "type": {
//                                                               "S": "initializeAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "tokenAddress": {
//                                                                       "S": "993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk"
//                                                                   },
//                                                                   "owner": {
//                                                                       "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                                                   },
//                                                                   "initAcount": {
//                                                                       "S": "E1fpumkQhJtSheP2oQYkABa99eoP1gMm5nRTVV7grWAL"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Create Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "system"
//                                                           },
//                                                           "type": {
//                                                               "S": "createAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "transferAmount(SOL)": {
//                                                                       "N": "0.00203928"
//                                                                   },
//                                                                   "newAccount": {
//                                                                       "S": "6qEBo65ys64vS5dZ3uFGBc4GBJVoqjdnsHthtgYzexUv"
//                                                                   },
//                                                                   "source": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "programOwner": {
//                                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "11111111111111111111111111111111"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Initialize Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "spl-token"
//                                                           },
//                                                           "type": {
//                                                               "S": "initializeAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "tokenAddress": {
//                                                                       "S": "FgSsGV8GByPaMERxeQJPvZRZHf7zCBhrdYtztKorJS58"
//                                                                   },
//                                                                   "owner": {
//                                                                       "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                                                   },
//                                                                   "initAcount": {
//                                                                       "S": "6qEBo65ys64vS5dZ3uFGBc4GBJVoqjdnsHthtgYzexUv"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Create Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "system"
//                                                           },
//                                                           "type": {
//                                                               "S": "createAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "transferAmount(SOL)": {
//                                                                       "N": "0.00203928"
//                                                                   },
//                                                                   "newAccount": {
//                                                                       "S": "6VYBgH5RvBgmvDFtxQUuTErN5wTPwPtmooo5CXqrXbry"
//                                                                   },
//                                                                   "source": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "programOwner": {
//                                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "11111111111111111111111111111111"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Initialize Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "spl-token"
//                                                           },
//                                                           "type": {
//                                                               "S": "initializeAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "tokenAddress": {
//                                                                       "S": "GwbEoYmrmYToCNpEvnhMuVw6hmvRWn6QBFYJCwGfEDAT"
//                                                                   },
//                                                                   "owner": {
//                                                                       "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                                                   },
//                                                                   "initAcount": {
//                                                                       "S": "6VYBgH5RvBgmvDFtxQUuTErN5wTPwPtmooo5CXqrXbry"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Create Associated Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "spl-associated-token-account"
//                                                           },
//                                                           "type": {
//                                                               "S": "createAssociatedAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "associatedAccount": {
//                                                                       "S": "6HMHs6h4oCqToiLXT3VZZBP3RuamBPpSrhGrz74R56XZ"
//                                                                   },
//                                                                   "tokenAddress": {
//                                                                       "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                                                   },
//                                                                   "authority": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "tokenProgramId": {
//                                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Create Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "system"
//                                                           },
//                                                           "type": {
//                                                               "S": "createAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "transferAmount(SOL)": {
//                                                                       "N": "0.00203928"
//                                                                   },
//                                                                   "newAccount": {
//                                                                       "S": "6HMHs6h4oCqToiLXT3VZZBP3RuamBPpSrhGrz74R56XZ"
//                                                                   },
//                                                                   "source": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "programOwner": {
//                                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "11111111111111111111111111111111"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "initializeAccount3"
//                                                           },
//                                                           "program": {
//                                                               "S": "spl-token"
//                                                           },
//                                                           "type": {
//                                                               "S": "initializeAccount3"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "owner": {
//                                                                       "S": "9QmBVa3Pkgwk4SP3xS6Zfeb8GsQ4NPQLgSoui85srMs2"
//                                                                   },
//                                                                   "mint": {
//                                                                       "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                                                   },
//                                                                   "account": {
//                                                                       "S": "6HMHs6h4oCqToiLXT3VZZBP3RuamBPpSrhGrz74R56XZ"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Create Associated Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "spl-associated-token-account"
//                                                           },
//                                                           "type": {
//                                                               "S": "createAssociatedAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "associatedAccount": {
//                                                                       "S": "A2G6qWEpq963WqHmS7Mwjsqx7PnGiCTE2AXPKLReLutv"
//                                                                   },
//                                                                   "tokenAddress": {
//                                                                       "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                                                   },
//                                                                   "authority": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "tokenProgramId": {
//                                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "Create Account"
//                                                           },
//                                                           "program": {
//                                                               "S": "system"
//                                                           },
//                                                           "type": {
//                                                               "S": "createAccount"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "transferAmount(SOL)": {
//                                                                       "N": "0.00203928"
//                                                                   },
//                                                                   "newAccount": {
//                                                                       "S": "A2G6qWEpq963WqHmS7Mwjsqx7PnGiCTE2AXPKLReLutv"
//                                                                   },
//                                                                   "source": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "programOwner": {
//                                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "11111111111111111111111111111111"
//                                                           }
//                                                       }
//                                                   },
//                                                   {
//                                                       "M": {
//                                                           "name": {
//                                                               "S": "initializeAccount3"
//                                                           },
//                                                           "program": {
//                                                               "S": "spl-token"
//                                                           },
//                                                           "type": {
//                                                               "S": "initializeAccount3"
//                                                           },
//                                                           "params": {
//                                                               "M": {
//                                                                   "owner": {
//                                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                                   },
//                                                                   "mint": {
//                                                                       "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                                                   },
//                                                                   "account": {
//                                                                       "S": "A2G6qWEpq963WqHmS7Mwjsqx7PnGiCTE2AXPKLReLutv"
//                                                                   }
//                                                               }
//                                                           },
//                                                           "programId": {
//                                                               "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                           }
//                                                       }
//                                                   }
//                                               ]
//                                           },
//                                           "index": {
//                                               "N": "1"
//                                           }
//                                       }
//                                   }
//                               ]
//                           },
//                           "tokenBalanes": {
//                               "L": [
//                                   {
//                                       "M": {
//                                           "owner": {
//                                               "S": "9QmBVa3Pkgwk4SP3xS6Zfeb8GsQ4NPQLgSoui85srMs2"
//                                           },
//                                           "amount": {
//                                               "M": {
//                                                   "preAmount": {
//                                                       "N": "0"
//                                                   },
//                                                   "postAmount": {
//                                                       "S": "0"
//                                                   }
//                                               }
//                                           },
//                                           "account": {
//                                               "S": "6HMHs6h4oCqToiLXT3VZZBP3RuamBPpSrhGrz74R56XZ"
//                                           },
//                                           "token": {
//                                               "M": {
//                                                   "tokenAddress": {
//                                                       "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                                   },
//                                                   "symbol": {
//                                                       "S": "cstlUSDC"
//                                                   },
//                                                   "decimals": {
//                                                       "N": "6"
//                                                   },
//                                                   "name": {
//                                                       "S": "Castle Vault USDC LP"
//                                                   },
//                                                   "icon": {
//                                                       "S": "https://raw.githubusercontent.com/castle-finance/castle-lp-token-list/main/assets/mainnet/866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE/icon.png"
//                                                   }
//                                               }
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "owner": {
//                                               "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                           },
//                                           "amount": {
//                                               "M": {
//                                                   "preAmount": {
//                                                       "N": "0"
//                                                   },
//                                                   "postAmount": {
//                                                       "S": "0"
//                                                   }
//                                               }
//                                           },
//                                           "account": {
//                                               "S": "6qEBo65ys64vS5dZ3uFGBc4GBJVoqjdnsHthtgYzexUv"
//                                           },
//                                           "token": {
//                                               "M": {
//                                                   "tokenAddress": {
//                                                       "S": "FgSsGV8GByPaMERxeQJPvZRZHf7zCBhrdYtztKorJS58"
//                                                   },
//                                                   "symbol": {
//                                                       "S": "pUSDC"
//                                                   },
//                                                   "decimals": {
//                                                       "N": "6"
//                                                   },
//                                                   "name": {
//                                                       "S": "Port Finance USDC"
//                                                   },
//                                                   "icon": {
//                                                       "S": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FgSsGV8GByPaMERxeQJPvZRZHf7zCBhrdYtztKorJS58/USDC.svg"
//                                                   }
//                                               }
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "owner": {
//                                               "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                           },
//                                           "amount": {
//                                               "M": {
//                                                   "preAmount": {
//                                                       "N": "0"
//                                                   },
//                                                   "postAmount": {
//                                                       "S": "0"
//                                                   }
//                                               }
//                                           },
//                                           "account": {
//                                               "S": "6VYBgH5RvBgmvDFtxQUuTErN5wTPwPtmooo5CXqrXbry"
//                                           },
//                                           "token": {
//                                               "M": {
//                                                   "tokenAddress": {
//                                                       "S": "GwbEoYmrmYToCNpEvnhMuVw6hmvRWn6QBFYJCwGfEDAT"
//                                                   },
//                                                   "decimals": {
//                                                       "N": "6"
//                                                   }
//                                               }
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "owner": {
//                                               "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                           },
//                                           "amount": {
//                                               "M": {
//                                                   "preAmount": {
//                                                       "N": "0"
//                                                   },
//                                                   "postAmount": {
//                                                       "S": "0"
//                                                   }
//                                               }
//                                           },
//                                           "account": {
//                                               "S": "A2G6qWEpq963WqHmS7Mwjsqx7PnGiCTE2AXPKLReLutv"
//                                           },
//                                           "token": {
//                                               "M": {
//                                                   "tokenAddress": {
//                                                       "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                                   },
//                                                   "symbol": {
//                                                       "S": "cstlUSDC"
//                                                   },
//                                                   "decimals": {
//                                                       "N": "6"
//                                                   },
//                                                   "name": {
//                                                       "S": "Castle Vault USDC LP"
//                                                   },
//                                                   "icon": {
//                                                       "S": "https://raw.githubusercontent.com/castle-finance/castle-lp-token-list/main/assets/mainnet/866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE/icon.png"
//                                                   }
//                                               }
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "owner": {
//                                               "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                           },
//                                           "amount": {
//                                               "M": {
//                                                   "preAmount": {
//                                                       "N": "0"
//                                                   },
//                                                   "postAmount": {
//                                                       "S": "0"
//                                                   }
//                                               }
//                                           },
//                                           "account": {
//                                               "S": "DzUzw5PyN9mXBHirtEn8GPAkFU1Y7seVaSr6MaWDUw9S"
//                                           },
//                                           "token": {
//                                               "M": {
//                                                   "tokenAddress": {
//                                                       "S": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
//                                                   },
//                                                   "symbol": {
//                                                       "S": "USDC"
//                                                   },
//                                                   "decimals": {
//                                                       "N": "6"
//                                                   },
//                                                   "name": {
//                                                       "S": "USD Coin"
//                                                   },
//                                                   "icon": {
//                                                       "S": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
//                                                   }
//                                               }
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "owner": {
//                                               "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                           },
//                                           "amount": {
//                                               "M": {
//                                                   "preAmount": {
//                                                       "N": "0"
//                                                   },
//                                                   "postAmount": {
//                                                       "S": "0"
//                                                   }
//                                               }
//                                           },
//                                           "account": {
//                                               "S": "E1fpumkQhJtSheP2oQYkABa99eoP1gMm5nRTVV7grWAL"
//                                           },
//                                           "token": {
//                                               "M": {
//                                                   "tokenAddress": {
//                                                       "S": "993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk"
//                                                   },
//                                                   "symbol": {
//                                                       "S": "cUSDC"
//                                                   },
//                                                   "decimals": {
//                                                       "N": "6"
//                                                   },
//                                                   "name": {
//                                                       "S": "Solend USDC"
//                                                   },
//                                                   "icon": {
//                                                       "S": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk/logo.png"
//                                                   }
//                                               }
//                                           }
//                                       }
//                                   }
//                               ]
//                           },
//                           "parsedInstruction": {
//                               "L": [
//                                   {
//                                       "M": {
//                                           "data": {
//                                               "S": "0000000080016000000000000803000000000000ac1e40a5ad5894885321b9813d2a45da3263d0c6b9fe0874a689744170e0f379"
//                                           },
//                                           "name": {
//                                               "S": "Create Account"
//                                           },
//                                           "program": {
//                                               "S": "system"
//                                           },
//                                           "type": {
//                                               "S": "createAccount"
//                                           },
//                                           "params": {
//                                               "M": {
//                                                   "transferAmount(SOL)": {
//                                                       "N": "0.00629184"
//                                                   },
//                                                   "newAccount": {
//                                                       "S": "3tBqjyYtf9Utb1NNsx4o7AV1qtzHoxsMXgkmat3rZ3y6"
//                                                   },
//                                                   "source": {
//                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                   },
//                                                   "programOwner": {
//                                                       "S": "Cast1eoVj8hwfKKRPji4cqX7WFgcnYz3um7TTgnaJKFn"
//                                                   }
//                                               }
//                                           },
//                                           "programId": {
//                                               "S": "11111111111111111111111111111111"
//                                           },
//                                           "dataEncode": {
//                                               "S": "11115hLrEPdSJSGU1L4aS5uccmduWkos6J9rEwgJyiuZdYXetcbPqADBpywqw1G72wtkBr"
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "data": {
//                                               "S": "afaf6d1f0d989bedfefefefffffdffffffffffffffff0000000000000000003c0100"
//                                           },
//                                           "name": {
//                                               "S": "Instruction 1"
//                                           },
//                                           "type": {
//                                               "S": "Unknown"
//                                           },
//                                           "params": {
//                                               "M": {
//                                                   "Account20": {
//                                                       "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                                   },
//                                                   "Account13": {
//                                                       "S": "3ARjV1TvKbQoHAFyQW5P85F7AX5U58Hm2zwTRHGN4v4A"
//                                                   },
//                                                   "Account12": {
//                                                       "S": "DcENuKuYd6BWGhKfGr7eARxodqG12Bz1sN5WA8NwvLRx"
//                                                   },
//                                                   "Account11": {
//                                                       "S": "BgxfHJDzm44T7XG68MYKx7YisTjZu73tVovyZSjJMpmw"
//                                                   },
//                                                   "Account22": {
//                                                       "S": "SysvarRent111111111111111111111111111111111"
//                                                   },
//                                                   "Account10": {
//                                                       "S": "GwbEoYmrmYToCNpEvnhMuVw6hmvRWn6QBFYJCwGfEDAT"
//                                                   },
//                                                   "Account21": {
//                                                       "S": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
//                                                   },
//                                                   "Account5": {
//                                                       "S": "6qEBo65ys64vS5dZ3uFGBc4GBJVoqjdnsHthtgYzexUv"
//                                                   },
//                                                   "Account6": {
//                                                       "S": "6VYBgH5RvBgmvDFtxQUuTErN5wTPwPtmooo5CXqrXbry"
//                                                   },
//                                                   "Account7": {
//                                                       "S": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
//                                                   },
//                                                   "Account8": {
//                                                       "S": "993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk"
//                                                   },
//                                                   "Account9": {
//                                                       "S": "FgSsGV8GByPaMERxeQJPvZRZHf7zCBhrdYtztKorJS58"
//                                                   },
//                                                   "Account17": {
//                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                   },
//                                                   "Account16": {
//                                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                                   },
//                                                   "Account15": {
//                                                       "S": "A2G6qWEpq963WqHmS7Mwjsqx7PnGiCTE2AXPKLReLutv"
//                                                   },
//                                                   "Account0": {
//                                                       "S": "3tBqjyYtf9Utb1NNsx4o7AV1qtzHoxsMXgkmat3rZ3y6"
//                                                   },
//                                                   "Account14": {
//                                                       "S": "6HMHs6h4oCqToiLXT3VZZBP3RuamBPpSrhGrz74R56XZ"
//                                                   },
//                                                   "Account1": {
//                                                       "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                                   },
//                                                   "Account2": {
//                                                       "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                                   },
//                                                   "Account3": {
//                                                       "S": "DzUzw5PyN9mXBHirtEn8GPAkFU1Y7seVaSr6MaWDUw9S"
//                                                   },
//                                                   "Account19": {
//                                                       "S": "11111111111111111111111111111111"
//                                                   },
//                                                   "Account4": {
//                                                       "S": "E1fpumkQhJtSheP2oQYkABa99eoP1gMm5nRTVV7grWAL"
//                                                   },
//                                                   "Account18": {
//                                                       "S": "9QmBVa3Pkgwk4SP3xS6Zfeb8GsQ4NPQLgSoui85srMs2"
//                                                   }
//                                               }
//                                           },
//                                           "programId": {
//                                               "S": "Cast1eoVj8hwfKKRPji4cqX7WFgcnYz3um7TTgnaJKFn"
//                                           },
//                                           "dataEncode": {
//                                               "S": "4yMVZ7r6bdxBLTVxn1Ne5xRwm7Am4BtWjtQbsvnU1Mb1tHM"
//                                           }
//                                       }
//                                   }
//                               ]
//                           },
//                           "blockTime": {
//                               "N": "1651802210"
//                           },
//                           "mainActions": {
//                               "L": []
//                           },
//                           "txHash": {
//                               "S": "4hrtCR3uZJKvbF4oJ52A1irRtkSvuCvcRohiogZ9ScHtzzef583o9h1oyPQSv4GdwppdW9oxdC2cAwLfY6akeqsW"
//                           },
//                           "inputAccount": {
//                               "L": [
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "9361470720"
//                                           },
//                                           "preBalance": {
//                                               "N": "9381469840"
//                                           },
//                                           "account": {
//                                               "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                           },
//                                           "signer": {
//                                               "BOOL": true
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "6291840"
//                                           },
//                                           "preBalance": {
//                                               "N": "0"
//                                           },
//                                           "account": {
//                                               "S": "3tBqjyYtf9Utb1NNsx4o7AV1qtzHoxsMXgkmat3rZ3y6"
//                                           },
//                                           "signer": {
//                                               "BOOL": true
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "0"
//                                           },
//                                           "preBalance": {
//                                               "N": "0"
//                                           },
//                                           "account": {
//                                               "S": "3ioTMtbR2u4vT6k6jN6g8LzBqgysHpPLnRfcUPNWr9q7"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "2039280"
//                                           },
//                                           "preBalance": {
//                                               "N": "0"
//                                           },
//                                           "account": {
//                                               "S": "6HMHs6h4oCqToiLXT3VZZBP3RuamBPpSrhGrz74R56XZ"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "2039280"
//                                           },
//                                           "preBalance": {
//                                               "N": "0"
//                                           },
//                                           "account": {
//                                               "S": "6qEBo65ys64vS5dZ3uFGBc4GBJVoqjdnsHthtgYzexUv"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "2039280"
//                                           },
//                                           "preBalance": {
//                                               "N": "0"
//                                           },
//                                           "account": {
//                                               "S": "6VYBgH5RvBgmvDFtxQUuTErN5wTPwPtmooo5CXqrXbry"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "1461600"
//                                           },
//                                           "preBalance": {
//                                               "N": "0"
//                                           },
//                                           "account": {
//                                               "S": "866Z6snjQuaAzs6gubHJwPQso6jCrPHrZCY7GqoFVAEE"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "2039280"
//                                           },
//                                           "preBalance": {
//                                               "N": "0"
//                                           },
//                                           "account": {
//                                               "S": "A2G6qWEpq963WqHmS7Mwjsqx7PnGiCTE2AXPKLReLutv"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "2039280"
//                                           },
//                                           "preBalance": {
//                                               "N": "0"
//                                           },
//                                           "account": {
//                                               "S": "DzUzw5PyN9mXBHirtEn8GPAkFU1Y7seVaSr6MaWDUw9S"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "2039280"
//                                           },
//                                           "preBalance": {
//                                               "N": "0"
//                                           },
//                                           "account": {
//                                               "S": "E1fpumkQhJtSheP2oQYkABa99eoP1gMm5nRTVV7grWAL"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": true
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "1"
//                                           },
//                                           "preBalance": {
//                                               "N": "1"
//                                           },
//                                           "account": {
//                                               "S": "11111111111111111111111111111111"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "15200640"
//                                           },
//                                           "preBalance": {
//                                               "N": "15200640"
//                                           },
//                                           "account": {
//                                               "S": "3ARjV1TvKbQoHAFyQW5P85F7AX5U58Hm2zwTRHGN4v4A"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "1461600"
//                                           },
//                                           "preBalance": {
//                                               "N": "1461600"
//                                           },
//                                           "account": {
//                                               "S": "993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "14785837280"
//                                           },
//                                           "preBalance": {
//                                               "N": "14785837280"
//                                           },
//                                           "account": {
//                                               "S": "9QmBVa3Pkgwk4SP3xS6Zfeb8GsQ4NPQLgSoui85srMs2"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "853073280"
//                                           },
//                                           "preBalance": {
//                                               "N": "853073280"
//                                           },
//                                           "account": {
//                                               "S": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "5199120"
//                                           },
//                                           "preBalance": {
//                                               "N": "5199120"
//                                           },
//                                           "account": {
//                                               "S": "BgxfHJDzm44T7XG68MYKx7YisTjZu73tVovyZSjJMpmw"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "1141440"
//                                           },
//                                           "preBalance": {
//                                               "N": "1141440"
//                                           },
//                                           "account": {
//                                               "S": "Cast1eoVj8hwfKKRPji4cqX7WFgcnYz3um7TTgnaJKFn"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "4892880"
//                                           },
//                                           "preBalance": {
//                                               "N": "4892880"
//                                           },
//                                           "account": {
//                                               "S": "DcENuKuYd6BWGhKfGr7eARxodqG12Bz1sN5WA8NwvLRx"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "122356825965"
//                                           },
//                                           "preBalance": {
//                                               "N": "122356825965"
//                                           },
//                                           "account": {
//                                               "S": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "1461600"
//                                           },
//                                           "preBalance": {
//                                               "N": "1461600"
//                                           },
//                                           "account": {
//                                               "S": "FgSsGV8GByPaMERxeQJPvZRZHf7zCBhrdYtztKorJS58"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "1461600"
//                                           },
//                                           "preBalance": {
//                                               "N": "1461600"
//                                           },
//                                           "account": {
//                                               "S": "GwbEoYmrmYToCNpEvnhMuVw6hmvRWn6QBFYJCwGfEDAT"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "1009200"
//                                           },
//                                           "preBalance": {
//                                               "N": "1009200"
//                                           },
//                                           "account": {
//                                               "S": "SysvarRent111111111111111111111111111111111"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   },
//                                   {
//                                       "M": {
//                                           "postBalance": {
//                                               "N": "953185920"
//                                           },
//                                           "preBalance": {
//                                               "N": "953185920"
//                                           },
//                                           "account": {
//                                               "S": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//                                           },
//                                           "signer": {
//                                               "BOOL": false
//                                           },
//                                           "writable": {
//                                               "BOOL": false
//                                           }
//                                       }
//                                   }
//                               ]
//                           },
//                           "status": {
//                               "S": "Success"
//                           },
//                           "signer": {
//                               "L": [
//                                   {
//                                       "S": "6nWKRgDkd8R4zkZb3ndExA9dVdp64g3uMwhDWP2afMNH"
//                                   },
//                                   {
//                                       "S": "3tBqjyYtf9Utb1NNsx4o7AV1qtzHoxsMXgkmat3rZ3y6"
//                                   }
//                               ]
//                           },
//                           "recentBlockhash": {
//                               "S": "5jkJW3tu2Mhw2s3aDdLdaDd3BrB7Gxnw4kccpNKLBhQZ"
//                           }
//                       }
//                   },
//                   "blockTime": {
//                       "N": "1651802210"
//                   },
//                   "txHash": {
//                       "S": "4hrtCR3uZJKvbF4oJ52A1irRtkSvuCvcRohiogZ9ScHtzzef583o9h1oyPQSv4GdwppdW9oxdC2cAwLfY6akeqsW"
//                   }
//               },
//               "SequenceNumber": "100000000006678581105",
//               "SizeBytes": 15463,
//               "StreamViewType": "NEW_IMAGE"
//           },
//           "eventSourceARN": "arn:aws:dynamodb:us-east-1:410462221023:table/vault-transactions-raw-sol-maxyield-proofchecker-alloccap60-devnetstaging-v2/stream/2022-08-05T03:06:29.529"
//       }
//   ]
// }

// // // //

/**
 * Define handler for normalize-raw-transaction lambda
 */
export const handler = async (
    event: any = {},
    context: any = {}
): Promise<any> => {
    // Log start message
    console.log("normalize-raw-transaction -> start");
    console.log(JSON.stringify(event, null, 4));

    // Define references to environment vars from process.env
    const TABLE_NAME = getEnv({ key: "NORMALIZED_TRANSACTIONS_TABLE_NAME" });

    // Wrap async/await invocations in try-catch
    try {
        // Short-circuit if event.records isn't defined
        if (!event.Records) {
            throw new Error(
                "event.Records not defined on lambda event parameter."
            );
        }

        // Pull reference to a single record
        const record = event.Records[0] || null;

        // Short-circuit if record isn't defined
        if (!record) {
            throw new Error("Record not found in lambda event parameter.");
        }

        // Log raw record
        console.log("record:");
        console.log(JSON.stringify(record, null, 4));

        // Parse DynamoDB -> NewImage value from event
        const rawTx: RawTransaction = AWS.DynamoDB.Converter.output({
            M: record.dynamodb.NewImage,
        }).raw;

        // Log raw transaction
        console.log("rawTx:");
        console.log(JSON.stringify(rawTx, null, 4));

        // Pull action + amount + status + fee + blockTime + slot + txHash
        // "Program log: DepositToCastle"
        // "Program log: WithdrawFromCastle"
        // TODO - update this to pull action from raw transaction
        let action = "other";
        const { status, fee, blockTime, txHash, slot, logMessage, signer } =
            rawTx;

        if (logMessage.includes("Program log: DepositToCastle")) {
            action = "deposit";
        } else if (logMessage.includes("Program log: WithdrawFromCastle")) {
            action = "withdraw";
        } else {
            // Log non-standard transaction -> skip normalization for now,
            // but we'll circle back to this later
            console.log(
                "Non-standard transaction detected - skip normalization step."
            );
            return;
        }

        // TODO - Short-circuit if these values aren't defined!
        // TODO - split up so there's one transaction-per-signer

        // Defines the params for db.put
        const putItemInput: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: TABLE_NAME,
            Item: {
                [TX_HASH_PARTITION_KEY]: txHash,
                walletID: signer[0], // First signer only, come back to this later
                blockTime,
                status,
                fee,
                slot,
                action,
                amount: 0, // TODO - populate this value
            },
        };

        console.log("putItemInput");
        console.log(putItemInput);

        // Inserts the record into the DynamoDB table
        await db.put(putItemInput).promise();
    } catch (error) {
        // Handle lambda errors here
        console.log("normalize-raw-transaction -> try/catch -> error");
        return context.fail(error);
    } finally {
        // Recover from errors here
        console.log("normalize-raw-transaction -> try/catch -> finally");
    }

    // Logs "shutdown" statement
    console.log("normalize-raw-transaction -> shutdown");
    return context.succeed();
};
