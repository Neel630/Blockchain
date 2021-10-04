require("babel-register");
require("babel-polyfill");
// const HDWalletProvider = require("@truffle/hdwallet-provider");
// const mnemonic = "";
// const rinkibyInfuraURL = "";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    // rinkeby: {
    //   provider: () => new HDWalletProvider(mnemonic, rinkibyInfuraURL),
    //   network_id: 4,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true,
    // },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "petersburg",
    },
  },
};
