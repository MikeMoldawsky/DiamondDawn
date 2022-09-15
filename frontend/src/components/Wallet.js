import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Wallet = () => {
  return <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />;
};

export default Wallet;
