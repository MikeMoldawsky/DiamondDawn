import React from "react";
import { useEffect } from "react";
import useMountLogger from "hooks/useMountLogger";
import { useProvider } from "wagmi";
import { useDispatch } from "react-redux";
import useActionDispatch from "hooks/useActionDispatch";
import useDDContract from "hooks/useDDContract";
import { loadConfig, loadSystemStage } from "store/systemReducer";
import { EVENTS } from "consts";
import useOnConnect from "hooks/useOnConnect";
import { readAndWatchAccountTokens, clearTokens } from "store/tokensReducer";
import { clearActionStatus } from "store/actionStatusReducer";
import { loadCollectorByAddress } from "store/collectorReducer";
import { isNoContractMode } from "utils";
import ContractProvider from "containers/ContractProvider";

const ServerAppLoader = () => {
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();

  useMountLogger("NoContractAppLoader");

  useEffect(() => {
    dispatch(loadConfig());
  }, []);

  useOnConnect(
    (address) => {
      dispatch(clearActionStatus("get-collector-by-address"));
      actionDispatch(
        loadCollectorByAddress(address),
        "get-collector-by-address"
      );
    },
    () => {
      dispatch(clearActionStatus("get-collector-by-address"));
      dispatch({ type: "RESET_STATE" });
    }
  );

  return null;
};

const ChainAppLoader = () => {
  const provider = useProvider();
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const contract = useDDContract();

  useMountLogger("AppLoader");

  useEffect(() => {
    dispatch(loadSystemStage(contract));

    provider.once("block", () => {
      contract.on(EVENTS.StageChanged, (_stage) => {
        console.log("EVENT StageChanged fired", { _stage });
        dispatch(loadSystemStage(contract));
        setTimeout(() => dispatch(loadConfig()), 5000);
      });
    });

    return () => {
      contract.removeAllListeners();
    };
  }, []);

  useOnConnect(
    (address) => {
      dispatch(clearTokens());
      dispatch(
        readAndWatchAccountTokens(actionDispatch, contract, provider, address)
      );
    },
    () => {
      dispatch(clearActionStatus("load-nfts"));
    }
  );

  return null;
};

export default isNoContractMode()
  ? ServerAppLoader
  : () => (
      <>
        <ServerAppLoader />
        <ContractProvider>
          <ChainAppLoader />
        </ContractProvider>
      </>
    );
