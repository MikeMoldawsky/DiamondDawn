import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./Wallet.scss";

const Wallet = (props) => {
  return (
    <ConnectButton
      label="Connect"
      accountStatus="address"
      chainStatus="none"
      showBalance={false}
      {...props}
    />
  );
};

export default Wallet;
