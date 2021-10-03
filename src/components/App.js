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
      daiTokenBalance: 0,
      dappTokenBalance: 0,
      stakingBalance: 0,
      loading: true,
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
        tokenFarmBalance: tokenFarmBalance.toString(),
      });
    } else {
      window.alert("Please change network to Rinkiby in Metamask and refresh");
      return;
    }

    this.setState({
      loading: false,
    });
  }

  render() {
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
                  <Farm />
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
