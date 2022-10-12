/// Make results public for testing only ///

const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
  parties,
} = require("../../helper-hardhat.config");
const { expect, assert } = require("chai");
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Voting unit test", function () {
      let voting, deployer, interval;
      const chainId = network.config.chainId;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        voting = await ethers.getContract("Voting", deployer);
        interval = await voting.getInterval();
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
          const party = await voting.getPartiesName(0);

          expect(party).to.equal(parties[0]);
        });
        it("Voting mapping are initialize with zero", async function () {
          await voting.setVoting(parties);
          const votingNumber1 = await voting.getVotes(0);
          const votingNumber2 = await voting.getVotes(1);
          const votingNumber3 = await voting.getVotes(2);

          expect(votingNumber1).to.equal(0);
          expect(votingNumber2).to.equal(0);
          expect(votingNumber3).to.equal(0);
        });

        it("Should not set before time interval", async function () {
          await voting.setVoting(parties);
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 5,
          ]);
          await network.provider.send("evm_mine", []);

          await expect(voting.setVoting(parties)).to.be.revertedWith(
            "Voting__PreviousVotingRemaining"
          );
        });

        it("Should emit event properly", async function () {
          await expect(voting.setVoting(parties)).to.emit(voting, "NewVoting");
        });
      });

      describe("vote", () => {
        it("Should not vote again if voted already", async function () {
          await voting.setVoting(parties);
          await voting.vote(0);
          await expect(voting.vote(0)).to.be.revertedWith(
            "Voting__CannotVoteAgain"
          );
        });

        it("count of votes should be increased", async function () {
          await voting.setVoting(parties);
          const beforeVoting = await voting.getVotes(0);
          await voting.vote(0);
          const afterVoting = await voting.getVotes(0);
          expect(afterVoting.toNumber()).to.equal(beforeVoting.toNumber() + 1);
        });

        it("Should emit event properly", async function () {
          await expect(voting.vote(0)).to.emit(voting, "Voted");
        });
      });

      describe("CheckUpKeep ", () => {
        it("returns false if enough time hasn't passed", async () => {
          await voting.setVoting(parties);
          await voting.vote(0);
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() - 5,
          ]); // use a higher number here if this test fails
          await network.provider.send("evm_mine", []);
          const { upkeepNeeded } = await voting.callStatic.checkUpkeep("0x");
          console.log(upkeepNeeded);
          expect(upkeepNeeded).to.equal(false);
        });
      });

     
    });
