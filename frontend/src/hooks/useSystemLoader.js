import React, { useEffect } from "react";
import { useAccount, useProvider } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import useDDContract from "hooks/useDDContract";
import { fetchStage, fetchStagesConfig, setStage } from "store/systemReducer";
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
    dispatch(fetchStage(contract));
    dispatch(fetchStagesConfig());

    provider.once("block", () => {
      contract.on(EVENTS.StageChanged, (_stage, _isStageActive) => {
        console.log("EVENT StageChanged fired", { _stage, _isStageActive });
        dispatch(setStage(_stage, _isStageActive));
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
