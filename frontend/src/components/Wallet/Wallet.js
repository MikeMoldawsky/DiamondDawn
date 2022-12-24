import React from "react";
import "./Wallet.scss";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useEnsName } from "wagmi";
import { shortenEthAddress } from "utils";
import classNames from "classnames";

const Wallet = ({ className, connectedText }) => {
  const account = useAccount();
  const ensName = useEnsName({ address: account?.address });
  const { isOpen, open, close } = useWeb3Modal();

  const getText = () => {
    if (!account?.address) return "CONNECT";

    return (
      connectedText || ensName?.data || shortenEthAddress(account?.address)
    );
  };

  return (
    <div
      className={classNames(
        "link-hover wallet",
        {
          connected: !!account?.address,
        },
        className
      )}
      onClick={() => (isOpen ? close() : open())}
    >
      {getText()}
    </div>
  );
};

export default Wallet;
