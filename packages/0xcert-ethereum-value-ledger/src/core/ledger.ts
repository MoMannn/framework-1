import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { normalizeAddress, BN } from '@0xcert/ethereum-utils';
import { ValueLedgerBase, ValueLedgerDeployRecipe, ValueLedgerInfo, ValueLedgerTransferRecipe, OrderGatewayBase } from "@0xcert/scaffold";
import deploy from '../mutations/deploy';
import getBalance from '../queries/get-balance';
import getInfo from '../queries/get-info';
import approveAccount from '../mutations/approve-account';
import getAllowance from '../queries/get-allowance';
import transfer from '../mutations/transfer';
import transferFrom from '../mutations/transfer-from';
import approveOrderGateway from '../mutations/approve-order-gateway';

/**
 * 
 */
export class ValueLedger implements ValueLedgerBase {
  protected $id: string;
  protected $provider: GenericProvider;

  /**
   * 
   */
  public constructor(provider: GenericProvider, id: string) {
    this.$id = normalizeAddress(id);
    this.$provider = provider;
  }

  /**
   * 
   */
  public get id() {
    return this.$id;
  }

  /**
   * 
   */
  public get provider() {
    return this.$provider;
  }

  /**
   * 
   */
  public static async deploy(provider: GenericProvider, recipe: ValueLedgerDeployRecipe): Promise<Mutation> {
    return deploy(provider, recipe);
  }

  /**
   * 
   */
  public static getInstance(provider: GenericProvider, id: string): ValueLedger {
    return new ValueLedger(provider, id);
  }

  /**
   * 
   */
  public async getBalance(accountId: string): Promise<string> {
    return getBalance(this, accountId);
  }

  /**
   * 
   */
  public async getInfo(): Promise<ValueLedgerInfo> {
    return getInfo(this);
  }

  /**
   * 
   */
  public async approveAccount(accountId: string | OrderGatewayBase, value: string): Promise<Mutation> {
    return typeof accountId === 'string'
      ? approveAccount(this, accountId, value)
      : approveOrderGateway(this, accountId, value);
  }

  /**
   * 
   */
  public async getApprovedValue(accountId: string, spenderId: string): Promise<String> {
    return getAllowance(this, accountId, spenderId);
  }

  /**
   * 
   */
  public async isApprovedValue(accountId: string, spenderId: string, value: string): Promise<Boolean> {
    const approved = await getAllowance(this, accountId, spenderId);
    return new BN(approved).gte(new BN(value));
  }

 /**
  * 
  */
 public async transferValue(data: ValueLedgerTransferRecipe): Promise<Mutation> {
   if(data.senderId === undefined)
   {
     return transfer(this, data.receiverId, data.value);
   }else
   {
     return transferFrom(this, data.senderId, data.receiverId, data.value);
   }
 }
}