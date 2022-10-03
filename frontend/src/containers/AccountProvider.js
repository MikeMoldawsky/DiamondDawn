import React from "react";
import isEmpty from "lodash/isEmpty";
import ContractProvider from "containers/ContractProvider";
import { useAccount } from "wagmi";
import Wallet from "components/Wallet";

const AccountProvider = ({ children, withLoader }) => {
  const account = useAccount();

  const renderContent = () => {
    if (isEmpty(account?.address)) return (
      <div className="center-aligned-column loader-container">
        <Wallet />
      </div>
    )
    return children;
  };

  return (
    <ContractProvider withLoader={withLoader}>
      {renderContent()}
    </ContractProvider>
  );
};

export default AccountProvider;
