import React from "react";
import "./NotConnected.scss";
import { getCDNObjectUrl } from "utils";
import Wallet from "components/Wallet";

export const NotConnected = ({ viewName }) => {
  return (
    <div className="center-aligned-column box-content opaque not-connected">
      <div className="heading">
        <div className="leading-text">WELCOME</div>
        <div className="leading-text">TO {viewName}</div>
      </div>
      <div className="center-aligned-column bottom-content">
        <img src={getCDNObjectUrl("/images/infinity_icon.png")} alt="" />
        {/*<div className="secondary-text">CONNECT WALLET TO CONTINUE</div>*/}
        <Wallet label="CONNECT WALLET TO CONTINUE" className="button" />
      </div>
    </div>
  );
};

export default NotConnected;
