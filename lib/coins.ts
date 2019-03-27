require('dotenv').config()

let coins = [];
 
coins['DASH'] =  {
    "host": process.env.DASH_RPC_HOST,
    "port": process.env.DASH_RPC_PORT,
    "user": process.env.DASH_RPC_USER,
    "password": process.env.DASH_RPC_PASSWORD,
}

coins['BCH'] = {

    "host": process.env.BCH_RPC_HOST,
    "port": process.env.BCH_RPC_PORT,
    "user": process.env.BCH_RPC_USER,
    "password": process.env.BCH_RPC_PASSWORD,
}

coins['ZEN'] = {

    "host": process.env.ZEN_RPC_HOST,
    "port": process.env.ZEN_RPC_PORT,
    "user": process.env.ZEN_RPC_USER,
    "password": process.env.ZEN_RPC_PASSWORD,
}

coins['LTC'] = {

    "host": process.env.LTC_RPC_HOST,
    "port": process.env.LTC_RPC_PORT,
    "user": process.env.LTC_RPC_USER,
    "password": process.env.LTC_RPC_PASSWORD,
}

coins['DOGE'] = {

    "host": process.env.DOGE_RPC_HOST,
    "port": process.env.DOGE_RPC_PORT,
    "user": process.env.DOGE_RPC_USER,
    "password": process.env.DOGE_RPC_PASSWORD,
}

coins['SMART'] = {

    "host": process.env.SMART_RPC_HOST,
    "port": process.env.SMART_RPC_PORT,
    "user": process.env.SMART_RPC_USER,
    "password": process.env.SMART_RPC_PASSWORD,
}

export { coins }; 

