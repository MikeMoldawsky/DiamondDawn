import React from "react";
import { useSelector } from "react-redux";
import { isActionFirstCompleteSelector } from "components/ActionButton/ActionButton.module";
import Loading from "components/Loading";
import ContractProvider from "containers/ContractProvider";
import { useAccount } from "wagmi";
import Wallet from "components/Wallet";

const TokensProvider = ({ children, withLoader }) => {
  const account = useAccount();
  const isReady = useSelector(isActionFirstCompleteSelector("load-nfts"));

  const renderContent = () => {
    if (isReady) return children;
    if (!account?.address)
      return (
        <div className="center-aligned-column loader-container">
          <Wallet />
        </div>
      );
    if (withLoader) return <Loading />;

    return null;
  };

  return (
    <ContractProvider withLoader={withLoader}>
      {renderContent()}
    </ContractProvider>
  );
};

export default TokensProvider;
