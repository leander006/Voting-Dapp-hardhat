const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
  parties,
} = require("../../helper-hardhat.config");
const { expect, assert } = require("chai");
developmentChains.includes(network.name)
  ? describe.skip
  : describe("Voting stagging test", function () {});
