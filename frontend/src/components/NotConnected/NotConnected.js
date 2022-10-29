import React from "react";
import "./NotConnected.scss";
import Wallet from "components/Wallet";
import Logo from "components/Logo";

export const NotConnected = ({ viewName }) => {
  return (
    <div className="center-aligned-column box-content opaque not-connected">
      <div className="heading">
        <div className="leading-text">WELCOME</div>
        <div className="leading-text">TO {viewName}</div>
      </div>
      <Logo />
      <div className="connect-wallet">
        <Wallet label="CONNECT WALLET TO CONTINUE" className="button" />
      </div>
    </div>
  );
};

export default NotConnected;
