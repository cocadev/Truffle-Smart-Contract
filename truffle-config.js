const path = require("path");
require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const endpoints = {
  mainnet: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
  ropsten: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
};

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    //develop on Ganache check your config
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(process.env.MNEMONIC, endpoints.ropsten),
      network_id: 3,
      gas: 5500000,
      gasPrice: 0x01,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.3",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
