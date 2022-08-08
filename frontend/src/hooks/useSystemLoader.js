import React, { useEffect } from "react";
import { useAccount, useProvider } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import useDDContract from "hooks/useDDContract";
import { loadSystemStage, loadSystemSchedule } from "store/systemReducer";
import { EVENTS } from "consts";
import useEffectWithAccount from "hooks/useEffectWithAccount";
import { fetchAccountShippingTokens, loadAccountNfts } from "store/tokensReducer";
import { isActionFirstCompleteSelector } from "components/ActionButton/ActionButton.module";
import useMountLogger from "hooks/useMountLogger";

const useSystemLoader = () => {
  const account = useAccount();
  const provider = useProvider();
  const dispatch = useDispatch();
  const contract = useDDContract();
  const isReady = useSelector(isActionFirstCompleteSelector("load-nfts"));

  useMountLogger("useSystemLoader");

  useEffect(() => {
    dispatch(loadSystemStage(contract));
    dispatch(loadSystemSchedule());

    provider.once("block", () => {
      contract.on(EVENTS.SystemStageChanged, (_stage, _isStageActive) => {
        console.log("EVENT SystemStageChanged fired", { _stage, _isStageActive });
        dispatch(loadSystemStage(contract));
      });
    });

    return () => {
      contract.removeAllListeners();
    };
  }, []);

  useEffectWithAccount(() => {
    dispatch(loadAccountNfts(contract, provider, account?.address));
    dispatch(fetchAccountShippingTokens(contract, account.address));
  });

  return isReady;
};

export default useSystemLoader;
