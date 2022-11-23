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
import NoContractAppLoader from "./NoContractAppLoader";

const AppLoader = () => {
  const provider = useProvider();
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const contract = useDDContract();

  useMountLogger("AppLoader");

  useEffect(() => {
    dispatch(loadSystemStage(contract));
    dispatch(loadConfig());

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
      actionDispatch(
        loadCollectorByAddress(address),
        "get-collector-by-address"
      );
      dispatch(clearTokens());
      dispatch(
        readAndWatchAccountTokens(actionDispatch, contract, provider, address)
      );
    },
    () => {
      dispatch(clearActionStatus("get-collector-by-address"));
      dispatch(clearActionStatus("load-nfts"));
      dispatch({ type: "RESET_STATE" });
    }
  );

  return null;
};

export default isNoContractMode() ? NoContractAppLoader : AppLoader;
