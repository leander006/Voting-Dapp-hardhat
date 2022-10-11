const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
  parties,
} = require("../../helper-hardhat.config");
const { expect } = require("chai");
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Voting unit test", function () {
      let voting, deployer;
      const chainId = network.config.chainId;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        voting = await ethers.getContract("Voting", deployer);
      });

      describe("Constructor", function () {
        it("Initializes the sender and interval properly", async function () {
          const owner = await voting.i_owner();
          const interval = await voting.i_interval();
          expect(owner.toString()).to.equal(deployer.toString());
          expect(interval).to.equal(networkConfig[chainId]["interval"]);
        });
      });

      describe("setVoting", () => {
        it("Only owner can call this function ", async function () {
          const accounts = await ethers.getSigners();
          const accountContectedVoting = voting.connect(accounts[2]);
          await expect(
            accountContectedVoting.setVoting(parties)
          ).to.be.revertedWith("Voting__OnlyOwnerCanSetNewVoting");
        });

        it("Parties are stored successfully", async function () {
          await voting.setVoting(parties);
          const party = await voting.Parties();
          console.log(party);
          //     expect(party.length).to.equal(parties.length);
        });
      });
    });
