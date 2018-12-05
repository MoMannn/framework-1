import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { OrderGateway } from '@0xcert/ethereum-order-gateway';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';

interface Data {
  provider: GenericProvider;
  ledger: AssetLedger;
  gateway: OrderGateway;
  protocol: Protocol;
  bob: string;
  coinbase: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
    accountId: await stage.web3.eth.getCoinbase(),
  });

  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').xcert.instance.options.address;
  const orderGatewayId = stage.get('protocol').orderGateway.instance.options.address;

  stage.set('ledger', new AssetLedger(provider, ledgerId));
  stage.set('gateway', new OrderGateway(provider, orderGatewayId));
});

spec.before(async (stage) => {
  const xcert = stage.get('protocol').xcert;
  const coinbase = stage.get('coinbase');

  await xcert.instance.methods.mint(coinbase, '1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await xcert.instance.methods.mint(coinbase, '2', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
});

spec.test('approves account for token transfer', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const bob = ctx.get('bob');
  const ledger = ctx.get('ledger');

  await ledger.approveAccount(bob, '1');

  ctx.is(await xcert.instance.methods.getApproved('1').call(), bob);
});

spec.test('approves order gateway proxy for token transfer', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const gateway = ctx.get('gateway');
  const proxyId = ctx.get('protocol').nftokenSafeTransferProxy.instance.options.address;

  await ledger.approveAccount(gateway, '2');

  ctx.is(await xcert.instance.methods.getApproved('2').call(), proxyId);
});

export default spec;