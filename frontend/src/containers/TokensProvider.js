import React, { useEffect } from "react";
import isEmpty from "lodash/isEmpty";
import size from "lodash/size";
import { useSelector } from "react-redux";
import { isActionFirstCompleteSelector } from "store/actionStatusReducer";
import Loading from "components/Loading";
import ContractProvider from "containers/ContractProvider";
import { useAccount } from "wagmi";
import { tokensSelector } from "store/tokensReducer";
import { useNavigate } from "react-router-dom";

const TokensProvider = ({ children, withLoader, isGated }) => {
  const account = useAccount();
  const isReady = useSelector(isActionFirstCompleteSelector("load-nfts"));
  const tokens = useSelector(tokensSelector);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("TokensProvider", {
      isReady,
      tokens: size(tokens),
      account: account?.address,
    });
    if (
      isGated &&
      (isEmpty(account?.address) || (isReady && isEmpty(tokens)))
    ) {
      navigate("/");
    }
  }, [isReady, isGated, account?.address]);

  const renderContent = () => {
    if (isReady) return children;
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
