
require("dotenv").config();

import * as http from 'superagent';

import { coins } from './coins'

export class JsonRPC {

    host: string;
    port: string;
    user: string;
    password: string;
    fee: number;

    constructor(coin: string) {
      
      this.host = coins[coin].host 
      this.port = coins[coin].port 
      this.user = coins[coin].user 
      this.password = coins[coin].password 
      this.fee = coins[coin].fee
    }
    
    async call(method: string, params=[]) {
 
      if(this.port){

        let resp = await http
      			.post(`http://${this.host}:${this.port}`)
    			.auth(this.user, this.password)
    			.send({
      				method,
      				params
    			});

  	return resp.body.result;

      }else{

        let resp = await http
      			.post(`https://${this.host}`)
    			.auth(this.user, this.password)
    			.send({
      				method,
      				params
    			});

  	return resp.body.result;

      }
      
    }
}

export async function rpcCall(method: string, params=[]) {

  let resp = await http
    .post(`http://${process.env.DASH_RPC_HOST}:${process.env.DASH_RPC_PORT}`)
    .auth(process.env.DASH_RPC_USER, process.env.DASH_RPC_PASSWORD)
    .send({
      method,
      params
    });

  console.log(resp.body);

  return resp.body.result;
}
