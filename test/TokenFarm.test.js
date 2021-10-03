const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
  .use(require("chai-as-promised"))
  .should();

const toWei = (n) => web3.utils.toWei(n, "Ether");

contract("TokenFarm", ([owner, investor]) => {
  let daiToken;
  let dappToken;
  let tokenFarm;
  before(async () => {
    // load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // transfer all tokens to farm
    await dappToken.transfer(tokenFarm.address, toWei("1000000"));

    await daiToken.transfer(investor, toWei("100"), { from: owner });
  });

  describe("Mock DAI deployment", async () => {
    it("has a name", async () => {
      let name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      let name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("TokenFarm deployment", async () => {
    it("has a name", async () => {
      let name = await tokenFarm.name();
      assert.equal(name, "Token Farm");
    });

    it("contract has dapp tokens", async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), toWei("1000000"));
    });

    it("investor has dai tokens", async () => {
      let balance = await daiToken.balanceOf(investor);
      assert.equal(balance.toString(), toWei("100"));
    });
  });

  describe("Farming Tokens", async () => {
    it("rewards investors for staking", async () => {
      let result;

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        toWei("100"),
        "investor Mock DAI wallet balance correct before staking"
      );

      // Stake Mock DAI Tokens
      await daiToken.approve(tokenFarm.address, toWei("100"), {
        from: investor,
      });
      await tokenFarm.stakeTokens(toWei("100"), { from: investor });

      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        toWei("0"),
        "Investor dai token balance correct after staking"
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        toWei("100"),
        "Token Farm dai token balance correct after staking"
      );

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(
        result.toString(),
        toWei("100"),
        "Investor staking balance correct after staking"
      );

      result = await tokenFarm.isStaking(investor);
      assert.equal(
        result.toString(),
        "true",
        "Investor staking correctly showing"
      );

      await tokenFarm.issueTokens({ from: owner });
      result = await dappToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        toWei("100"),
        "Dapp token address correct after issuing reward for stake tokens"
      );

      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor });

      // Check results after unstaking
      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        toWei("100"),
        "investor Mock DAI wallet balance correct after staking"
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        toWei("0"),
        "Token Farm Mock DAI balance correct after staking"
      );

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(
        result.toString(),
        toWei("0"),
        "investor staking balance correct after staking"
      );

      result = await tokenFarm.isStaking(investor);
      assert.equal(
        result.toString(),
        "false",
        "investor staking status correct after staking"
      );
    });
  });
});
