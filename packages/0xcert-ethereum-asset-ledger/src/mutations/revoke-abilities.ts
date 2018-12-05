import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'revokeAbilities' && a.type === 'function'
));

/**
 * Revokes abilities from account.
 */
export default async function(ledger: AssetLedger, accountId: string, abilities: AssetLedgerAbility[]) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [accountId, abilities]),
    gas: 6000000,
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}