# transaction-indexer-lib

Shared modules used throughout the `vault-transaction-indexer` CDK stack.

**Usage**

Use in lambda modules by adding the following to each `package.json` file:

```json
{
    "dependencies": {
        "transaction-indexer-lib": "file:../../shared"
    }
}
```

After manually adding that line to `dependencies`, run `yarn install` - you should now be able to import code from `shared` module so long as it's exported in `shared/index.ts`

**Developing**

Run `yarn build` to build the TypeScript output of this module.
