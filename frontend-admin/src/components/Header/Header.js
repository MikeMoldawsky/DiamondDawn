import React from "react";
import logo from "assets/images/logo.png";
import "./Header.scss";

const Header = ({ children }) => {
  return (
    <header>
      <div className="header-internal">
        <div className="logo-box">
          <img src={logo} alt="DIAMOND DAWN" />
        </div>
        <div className="center-aligned-row">{children}</div>
      </div>
    </header>
  );
};

export default Header;
