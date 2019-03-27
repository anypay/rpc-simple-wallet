require('dotenv').config();

import { JsonRPC } from './jsonrpc'; 

import { BigNumber } from 'bignumber.js';

interface UTxO {
  txid: string;
  vout: number;
  address: string;
  account: string;
  scriptPubKey: string;
  amount: BigNumber;
  confirmations: number;
  spendable: boolean;
  solvable: boolean;
  ps_rounds: number;
}

export class RPCSimpleWallet extends JsonRPC {

  fee: number;

  coin: string;

  address: string;

  balance: number;

  utxos: UTxO[];

  constructor(coin: string, address?: string) {

    super(coin);

    this.coin = coin;

    this.fee = 0.0001;

    if (address) {

      this.address = address;

    }

  }

  async updateWallet() {

    let utxos = await this.call('listunspent',
        [0, 9999999, [this.address]]);

    this.utxos = utxos.sort((a,b) => a.amount > b.amount);

    this.balance = await this.getAddressUnspentBalance()
  }

  async getNewAddress() {

    let resp = await this.call('getnewaddress');

    this.address = resp;

    return resp;

  }

  async getAddressUnspentBalance() {

    if (!this.utxos) {
      await this.updateWallet();
    }

    return this.utxos.reduce((sum, tx) => {
      return sum.plus(tx.amount);
    }, new BigNumber(0)).toNumber();

  }

  async sendToAddress(address: string, amount: number) {

    if (this.balance < amount) {

      throw new Error(`insufficient balance to send ${amount}`);

    }

    var inputs = [];

    var sumInputs = new BigNumber(0); 

    for (let i=0; i < this.utxos.length; i++) {

      inputs.push(this.utxos[i])

      sumInputs = sumInputs.plus(new BigNumber(this.utxos[i].amount));

      if (sumInputs.isGreaterThanOrEqualTo(amount)) {
        break;
      }
      
    }

    let outputs = {};

    let outputAmount = new BigNumber(amount);

    outputs[address] = amount.toFixed(8);

    // change
    outputs[this.address] = sumInputs
      .minus(outputAmount)
      .minus(this.fee)
      .toNumber()
      .toFixed(8);

    let params = [
      inputs.map(i => {
        return {
          txid: i.txid,
          vout: i.vout
        }
      }),
      outputs
    ];

    var newRawTx;

    try {

      console.log('create raw tx params', params);

      newRawTx = await this.call('createrawtransaction', params);

      console.log("new raw tx");

    } catch(error) {

      console.error(error);

      throw error;

    }

    var signedtx;

    try {

      signedtx = await this.call('signrawtransaction', [newRawTx]);

      console.log('signedtx', signedtx);

    } catch(error) {

      console.error('signrawtransaction.error', error.message);

      throw error;

    }

    if (!signedtx.complete) {

      throw new Error(signedtx.errors[0].error);

    }

    var newtx;

    try {

      newtx = await this.call('sendrawtransaction', [signedtx.hex]);

    } catch(error) {

      console.error('sendrawtransaction.error', error);

    }

    return newtx;

  }

  async setAddress(address: string) {

    this.address = address;
  }

}

