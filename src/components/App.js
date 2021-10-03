import React, { Component } from "react";
import Web3 from "web3";
import Navbar from "./Navbar";
import Farm from "./Farm";
import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import "./App.css";
import Loader from "./Loader";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "No account connected",
      web3: null,
      daiToken: {},
      dappToken: {},
      tokenFarmToken: {},
      daiTokenBalance: "0",
      dappTokenBalance: "0",
      stakingBalance: "0",
      loading: true,
      farmLoading: false,
      error: null,
    };
  }

  async componentWillMount() {
    await this.initMetamask();
    await this.fetchBlockchainAccount();
  }

  async initMetamask() {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      // check for wallet
      console.info("Metamask successfully detected!");
    } else {
      window.alert("Please install MetaMask first.");
      return;
    }

    if (!this.web3) {
      try {
        this.web3 = new Web3(window.ethereum);

        await window.ethereum.enable();
      } catch (error) {
        window.alert("You need to allow MetaMask.");
        return;
      }
    }
  }

  async fetchBlockchainAccount() {
    const accounts = await this.web3.eth.getAccounts();
    console.info("account from metamask", accounts);
    this.setState({
      account: accounts[0],
    });

    let networkId = await this.web3.eth.net.getId();
    console.info("Network Id", networkId);

    const daiTokensData = DaiToken.networks[networkId];
    const dappTokensData = DappToken.networks[networkId];
    const tokenFarmData = TokenFarm.networks[networkId];

    if (daiTokensData) {
      const daiTokenContract = new this.web3.eth.Contract(
        DaiToken.abi,
        daiTokensData.address
      );

      const daiTokenBalance = await daiTokenContract.methods
        .balanceOf(this.state.account)
        .call();

      this.setState({
        daiToken: daiTokenContract,
        daiTokenBalance: daiTokenBalance.toString(),
      });
    } else {
      window.alert("Please change network to Rinkiby in Metamask and refresh");
      return;
    }

    if (dappTokensData) {
      const dappTokenContract = new this.web3.eth.Contract(
        DappToken.abi,
        dappTokensData.address
      );

      const dappTokenBalance = await dappTokenContract.methods
        .balanceOf(this.state.account)
        .call();

      this.setState({
        dappToken: dappTokenContract,
        dappTokenBalance: dappTokenBalance.toString(),
      });
    } else {
      window.alert("Please change network to Rinkiby in Metamask and refresh");
      return;
    }

    if (tokenFarmData) {
      const tokenFarmContract = new this.web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address
      );

      const tokenFarmBalance = await tokenFarmContract.methods
        .stakingBalance(this.state.account)
        .call();

      this.setState({
        tokenFarm: tokenFarmContract,
        stakingBalance: tokenFarmBalance.toString(),
      });
    } else {
      window.alert("Please change network to Rinkiby in Metamask and refresh");
      return;
    }

    this.setState({
      loading: false,
    });
  }

  speak = (msg, ind = 8) => {
    const sp = new SpeechSynthesisUtterance(msg);
    sp.voice = speechSynthesis.getVoices()[ind];
    sp.rate = 0.85;
    speechSynthesis.speak(sp);
  };

  stakeTokens = (amount) => {
    let self = this;
    this.setState({ farmLoading: true, error: null });
    this.state.daiToken.methods
      .approve(this.state.tokenFarm._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.tokenFarm.methods
          .stakeTokens(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            console.info("Transaction Hash", hash);
          })
          .on("receipt", function(receipt) {
            // receipt example
            console.info("receipt...", receipt);
            self.speak(`Token stake successfully`);
            window.location.reload();
            self.setState({
              farmLoading: false,
            });
          })
          .on("error", (error) => {
            console.error(error);
            self.speak(`Error invoking contract while staking token`);
            let errorMessage = "Error staking token, please try again ...";
            if (
              error.message &&
              error.message.includes("User denied transaction")
            ) {
              errorMessage =
                "MetaMask Tx Signature: User denied transaction signature.";
            } else if (
              error.message &&
              error.message.includes(
                "TXRejectedError: the tx doesn't have the correct nonce."
              )
            ) {
              errorMessage = "Clear previous transaction and try again";
            }
            self.setState({
              farmLoading: false,
              error: errorMessage,
            });
          });
      })
      .on("error", (error) => {
        console.error(error);
        self.speak(`Error invoking contract while staking token`);
        let errorMessage = "Error staking token, please try again ...";
        if (
          error.message &&
          error.message.includes("User denied transaction")
        ) {
          errorMessage =
            "MetaMask Tx Signature: User denied transaction signature.";
        }
        self.setState({
          farmLoading: false,
          error: errorMessage,
        });
      });
  };

  unstakeTokens = () => {
    this.setState({ farmLoading: true, error: null });
    let self = this;
    this.state.tokenFarm.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.info("Transaction Hash", hash);
      })
      .on("receipt", function(receipt) {
        // receipt example
        console.info("receipt...", receipt);
        self.setState({
          farmLoading: false,
        });
        self.speak(`Token unstake successfully`);

        window.location.reload();
      })
      .on("error", (error) => {
        console.error(error);
        self.speak(`Error invoking contract while unstaking token`);
        self.setState({
          farmLoading: false,
          error: "Error untaking token, please try again ...",
        });
      });
  };

  render() {
    const { daiTokenBalance, dappTokenBalance, stakingBalance } = this.state;
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <Loader />
        ) : (
          <div className="container-fluid mt-5">
            <div className="row">
              <main
                role="main"
                className="col-lg-12 ml-auto mr-auto"
                style={{ maxWidth: "600px" }}
              >
                <div className="content mr-auto ml-auto">
                  <a
                    href="https://github.com/Neel630/"
                    target="_blank"
                    rel="noopener noreferrer"
                  ></a>
                  <Farm
                    daiTokenBalance={daiTokenBalance}
                    dappTokenBalance={dappTokenBalance}
                    stakingBalance={stakingBalance}
                    fromWei={this.web3.utils.fromWei}
                    toWei={this.web3.utils.toWei}
                    stakeTokens={this.stakeTokens}
                    unstakeTokens={this.unstakeTokens}
                    error={this.state.error}
                    setError={(error) => this.setState({ error: error })}
                    farmLoading={this.state.farmLoading}
                  />
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
