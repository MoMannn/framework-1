```ts
## Available methods
A list of all available methods.

### Mutations
await ledger.assignAbilities(accountId, abilities);
await ledger.revokeAbilities(accountId, abilities);
await ledger.setEnabled(state);
await ledger.approveAccount(assetId, takerId); // ERC20 ERC721
await ledger.createAsset({ accountId, assetId, imprint });
await ledger.updateAsset(assetId, { imprint });
await ledger.destroyAsset(assetId);
await ledger.revokeAsset(assetId);
await ledger.update({ uriBase });

### Queries
await ledger.getAbilities(accountId);
await ledger.getCapabilities();
await ledger.getInfo();
await ledger.getSupply();
await ledger.isEnabled();
await ledger.isAprovedAccount(takerId, assetId); // ERC20 ERC721
await ledger.getAprovedAccount(assetId); // ERC20 ERC721
await ledger.getBalance(accountId);
await ledger.getAssetAccount(assetId);
await ledger.getAsset(assetId); // imprint, uri, assetId

## TODO
await ledger.transferAsset({ id, to, data? }); // Safe transfer is done, still needs normal transfer based on provider info implementation.
await ledger.setOperator(accountId, bool); // how to name this? 
await ledger.isOperator(ownerId, accountId); 
await ledger.clamTransferAsset(); // ??; transfer where from is not you
```

# TODO
- deploy contract - kako prebrati `ledgerId` ko je contract zdeployan