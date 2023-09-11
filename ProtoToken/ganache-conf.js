require('dotenv').config();
const shell = require('shelljs');
//
const command = `ganache --server.port=7545 --chain.networkId=5777 --wallet.mnemonic='${process.env.SECRET}'`;
//console.log(command);
shell.exec(command);