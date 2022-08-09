import React, { useSelector } from "react-redux";
import { isActionFirstCompleteSelector } from "components/ActionButton/ActionButton.module";
import Loading from "components/Loading";
import ContractProvider from "layout/ContractProvider";

const TokensProvider = ({ children, withLoader }) => {
  const isNftsLoaded = useSelector(isActionFirstCompleteSelector("load-nfts"));
  const isShippingNftsLoaded = useSelector(
    isActionFirstCompleteSelector("load-shipping-nfts")
  );
  const isReady = isNftsLoaded && isShippingNftsLoaded;

  return (
    <ContractProvider withLoader={withLoader}>
      {isReady ? children : withLoader ? <Loading /> : null}
    </ContractProvider>
  );
};

export default TokensProvider;
