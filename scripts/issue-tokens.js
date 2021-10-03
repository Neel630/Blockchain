const TokenFarm = artifacts.require("TokenFarm");

module.exports = async (callbackFunction) => {
  const tokenFarm = await TokenFarm.deployed();
  await tokenFarm.issueTokens();

  console.info("Token issued");

  callbackFunction();
};
