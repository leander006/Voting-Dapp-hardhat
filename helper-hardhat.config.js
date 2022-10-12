const { ethers } = require("hardhat");
const parties = ["BJP", "AAP", "Congress", "Communist Party of india"];
const networkConfig = {
  default: {
    name: "hardhat",
    keepersUpdateInterval: "30",
  },
  5: {
    name: "goerli",
    interval: "30",
  },
  31337: {
    name: "hardhat",
    interval: "60",
  },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 3;

module.exports = {
  networkConfig,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  developmentChains,
  parties,
};
