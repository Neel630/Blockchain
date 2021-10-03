import React from "react";
import stake from "../stake.png";

const Navbar = ({ account }) => {
  return (
    <div className="container-fluid pb-5">
      <nav className="navbar navbar-light p-3 fixed-top bg-light flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://github.com/Neel630/defi-dapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={stake}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
          &nbsp; DApp Token Farm
        </a>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{account}</small>
            </small>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
