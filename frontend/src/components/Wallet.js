import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Wallet = (props) => {
  return (
    <ConnectButton
      accountStatus="address"
      chainStatus="none"
      showBalance={false}
      {...props}
    />
  );
};

export default Wallet;
