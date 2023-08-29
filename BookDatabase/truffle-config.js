require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: process.env.ETHSCAN_API
  },
  networks: {
    wsl: {
      host: "172.17.192.1", // WSL IP (Ganache hostname changed to vEthernet(WSL))
      port: 7545,
      network_id: "5777"
    },
    goerli: {
      provider: new HDWalletProvider({
        mnemonic: {
          phrase: process.env.SECRET
        },
        providerOrUrl: process.env.INFURA_URL
      }),
      network_id: "5"
    } 
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
