require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: process.env.ETHSCAN_API
  },
  networks: {
    goerli: {
      provider: new HDWalletProvider({
        mnemonic: {
          phrase: process.env.SECRET
        },
        providerOrUrl: process.env.INFURA_URL
      }),
      network_id: "5"
    }, 
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
