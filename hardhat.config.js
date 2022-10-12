/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
      allowUnlimitedContractSize: true,
    },
    goerli: {
      chainId: 5,
      blockConfirmations: 6,
      url: process.env.GOERLI_RPC_URL,
      allowUnlimitedContractSize: true,
      accounts: [process.env.PRIVATE_KEY],
      gas: 5000000,
    },
    localhost: {
      chainId: 31337,
      blockConfirmations: 1,
      allowUnlimitedContractSize: true,
    },
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "key",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  mocha: {
    timeout: 500000,
  },
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
    },
  },
};
