import React from "react";
import tweezersLogo from "assets/images/logo.png";
import "./Header.scss";
import { NavLink } from "react-router-dom";
import DiamondList from "components/DiamondList";
import Wallet from "components/Wallet";
import ContractProvider from "layout/ContractProvider";

const Header = () => {
  return (
    <header>
      <div className="header-internal">
        <div className="logo-box">
          <NavLink to="/">
            <img src={tweezersLogo} alt="TWEEZERS" />
          </NavLink>
        </div>
        <div className="center-aligned-row">
          <ContractProvider>
            <DiamondList />
          </ContractProvider>
          <Wallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
