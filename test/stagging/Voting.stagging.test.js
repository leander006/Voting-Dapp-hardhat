const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
  parties,
} = require("../../helper-hardhat.config");
const { expect, assert } = require("chai");
developmentChains.includes(network.name)
  ? describe.skip
  : describe("Voting stagging test", function () {
    let voting, deployer, interval;
    const chainId = network.config.chainId;
    beforeEach(async function () {
      deployer = (await getNamedAccounts()).deployer;
      await deployments.fixture(["all"]);
      voting = await ethers.getContract("Voting", deployer);
      interval = await voting.getInterval();
    });
  });
