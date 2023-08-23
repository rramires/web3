module.exports = {
  networks: {
    wsl: {
      host: "172.17.192.1", // WSL IP (Ganache hostname changed to vEthernet(WSL))
      port: 7545,
      network_id: "5777"
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
