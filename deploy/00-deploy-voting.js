const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat.config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const interval = networkConfig[chainId]["interval"];
  const arguments = [interval];

  const voting = await deploy("Voting", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log("Verifying...");
    await verify(voting.address, arguments);
  }
};

module.exports.tags = ["all", "voting"];
