import React, { useEffect } from "react";
import useMountLogger from "hooks/useMountLogger";
import { useAccount, useProvider } from "wagmi";
import { useDispatch } from "react-redux";
import useActionDispatch from "hooks/useActionDispatch";
import useDDContract from "hooks/useDDContract";
import { loadSystemSchedule, loadSystemStage } from "store/systemReducer";
import { EVENTS } from "consts";
import useEffectWithAccount from "hooks/useEffectWithAccount";
import {
  loadAccountNfts,
  loadAccountShippingTokens,
} from "store/tokensReducer";

const AppLoader = () => {
  const account = useAccount();
  const provider = useProvider();
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const contract = useDDContract();

  useMountLogger("AppLoader");

  useEffect(() => {
    dispatch(loadSystemStage(contract));
    dispatch(loadSystemSchedule());

    provider.once("block", () => {
      contract.on(EVENTS.SystemStageChanged, (_stage) => {
        console.log("EVENT SystemStageChanged fired", { _stage });
        dispatch(loadSystemStage(contract));
      });
    });

    return () => {
      contract.removeAllListeners();
    };
  }, []);

  useEffectWithAccount(
    () => {
      actionDispatch(
        loadAccountNfts(contract, provider, account?.address),
        "load-nfts"
      );
      actionDispatch(
        loadAccountShippingTokens(contract, account.address),
        "load-shipping-nfts"
      );
    },
    () => {
      dispatch({ type: "RESET_STATE" });
    }
  );

  return null;
};

export default AppLoader;
