const { ether } = require("hardhat");
async function enterVoting() {
  const voting = await ether.getContract("Voting");
  voting.vote(1);
  console.log("Voted to AAP");
}

enterVoting()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
