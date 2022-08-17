# index-transaction-ids

Indexes transactions for a single vault.

**How it works**

-   Fetch most recent 10 transactions from Solscan.

-   Fetch the _oldest_ transaction stored in `raw-transactions` DynamoDB.

    -   If there are no transactions stored in DynamoDB, queue up the 10 most recent transactions from Solscan, then exit.

    -   If the oldest transaction stored in DynamoDB _is_ in the 10 most recent transactions from Solscan, queue up any new transactions and exit.

    -   Otherwise, query to Solscan API for the 10 transactions that precede the oldest transaction from DynamoDB and add them to the intake queue, then exit. This step will continue until all preceeding vault transactions are backfilled.

-   If the backfill is complete, ensure all new transactions are indexed.

    -   Fetch the _newest_ transaction stored in DynamoDB.

        -   If the 10 most recent transactions from Solscan includes the _newest_ transaction stored in DynamoDB, queue up any transactions newer than the newest transaction stored in DynamoDB, then exit.

        -   If not, query for subsequent pages of transactions until the page containing the newest transaction stored in DynamoDB is found - then, the transactions from this crawl are added to the intake queue, then exit.

**Caveats**

-   Currently the algorithm will miss transactions if there's a gap in the transaction crawling that's larger than the length of a single page of results from Solscan (currently 10, but we can go as high as 50). I.e. if there are 100 total transactions, and we have stored the first 20 and the last 50, the middle 30 might go undetected. Increasing the number of results returned by Solscan would reduce the probability of this problem manifesting.

-   We could counter this by adding a once-a-week run of a separate lambda to manually check all transactions to ensure everything is accounted for (but we probably shouldn't need to).
