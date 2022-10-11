const { ethers } = require("hardhat");
const { parties } = require("../helper-hardhat.config");

async function SetVoting() {
  const voting = await ethers.getContract("Voting");
  voting.setVoting(parties);
  console.log("Set parties!");
}

SetVoting()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
