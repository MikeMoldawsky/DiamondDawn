import React from "react";
import "./Wallet.scss";
import { Web3Button } from "@web3modal/react";

const Wallet = () => {
  return <Web3Button icon="hide" label="CONNECT" />;
  // return (
  //   <ConnectButton
  //     label="Connect"
  //     accountStatus="address"
  //     chainStatus="none"
  //     showBalance={false}
  //     {...props}
  //   />
  // );
};

export default Wallet;
