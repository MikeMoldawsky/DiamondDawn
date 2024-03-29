import React, { useEffect } from "react";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { isActionFirstCompleteSelector } from "store/actionStatusReducer";
import Loading from "components/Loading";
import ContractProvider from "containers/ContractProvider";
import { useAccount } from "wagmi";
import { ownedTokensSelector } from "store/tokensReducer";
import { useNavigate } from "react-router-dom";
import { ACTION_KEYS } from "consts";

const TokensProvider = ({ children, withLoader, isGated, goThrough }) => {
  const account = useAccount();
  const isReady = useSelector(
    isActionFirstCompleteSelector(ACTION_KEYS.LOAD_NFTS)
  );
  const tokens = useSelector(ownedTokensSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      isGated &&
      (isEmpty(account?.address) || (isReady && isEmpty(tokens)))
    ) {
      navigate("/");
    }
  }, [isReady, isGated, account?.address]);

  const renderContent = () => {
    if (isReady || goThrough) return children;
    if (withLoader) return <Loading />;

    return null;
  };

  return (
    <ContractProvider withLoader={withLoader} goThrough={goThrough}>
      {renderContent()}
    </ContractProvider>
  );
};

export default TokensProvider;
