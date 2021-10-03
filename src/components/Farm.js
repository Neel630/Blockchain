import React, { Fragment, useState } from "react";
import dai from "../dai.png";

const Farm = ({
  daiTokenBalance,
  dappTokenBalance,
  stakingBalance,
  stakeTokens,
  unstakeTokens,
  fromWei,
  toWei,
  error,
  farmLoading,
}) => {
  const [inputText, setInputText] = useState(null);

  const stakeToken = (event) => {
    event.preventDefault();
    let amount = inputText.toString();
    amount = toWei(inputText, "Ether");
    stakeTokens(amount);
  };

  const unstakeToken = (event) => {
    event.preventDefault();
    unstakeTokens();
  };

  return (
    <Fragment>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-borderless text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{fromWei(stakingBalance, "Ether")} mDAI</td>
              <td>{fromWei(dappTokenBalance, "Ether")} DApp</td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4">
          <div className="card-body">
            <form className="mb-3" onSubmit={stakeToken}>
              <div>
                <label className="float-left">
                  <b>Stake Tokens</b>
                </label>
                <span className="float-right text-muted">
                  Dai Token Balance: {fromWei(daiTokenBalance, "Ether")}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  onChange={(e) => setInputText(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height="32" alt="" />
                    &nbsp;&nbsp;&nbsp; mDAI
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={farmLoading}
              >
                {farmLoading && (
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}{" "}
                STAKE!
              </button>
            </form>
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={unstakeToken}
              disabled={farmLoading}
            >
              {farmLoading && (
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}{" "}
              UN STAKE
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Farm;
