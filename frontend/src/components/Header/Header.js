import React from "react";
import tweezersLogo from "assets/images/logo.png";
import "./Header.scss";
import { NavLink } from "react-router-dom";

const Header = ({ children }) => {
  return (
    <header>
      <div className="header-internal">
        <div className="logo-box">
          <NavLink to="/">
            <img src={tweezersLogo} alt="TWEEZERS" />
          </NavLink>
        </div>
        <div className="center-aligned-row">{children}</div>
      </div>
    </header>
  );
};

export default Header;
