import React from "react";
import tweezersLogo from "assets/images/logo.png";

const Header = ({ children }) => {
  return (
    <header>
      <div className="header-internal">
        <div className="logo-box">
          <img src={tweezersLogo} alt="TWEEZERS" />
        </div>
        <div>{children}</div>
      </div>
    </header>
  );
};

export default Header;
