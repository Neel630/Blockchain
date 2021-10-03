const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  // deploy dai token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  // deploy daap token
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  console.log("dappToken", dappToken.address);
  console.log("daiToken", daiToken.address);

  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  console.log("tokenFarm", tokenFarm.address);

  // Transfer all token to TokenFarm
  await dappToken.transfer(tokenFarm.address, "1000000000000000000000000");

  // Transfer 100 dai to 2nd account/ investor
  await daiToken.transfer(accounts[1], "100000000000000000000");
};
