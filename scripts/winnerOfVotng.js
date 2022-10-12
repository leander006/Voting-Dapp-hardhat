const { ethers } = require("hardhat");


async function Winner() {
  const voting = await ethers.getContract("Voting");
  await voting.setVoting(parties);
  console.log("Set parties!");
}

Winner()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
