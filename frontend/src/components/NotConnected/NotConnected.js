import React from "react";
import "./NotConnected.scss";
import Wallet from "components/Wallet";
import Logo from "components/Logo";

export const NotConnected = () => {
  return (
    <div className="center-aligned-column box-content opaque not-connected">
      <div className="heading">
        <div className="leading-text">WELCOME TO DIAMOND DAWN</div>
      </div>
      <Logo />
      <div className="connect-wallet">
        <Wallet label="CONNECT TO CONTINUE" />
      </div>
    </div>
  );
};

export default NotConnected;
