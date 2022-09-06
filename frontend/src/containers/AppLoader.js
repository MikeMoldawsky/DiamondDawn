import { useEffect } from "react";
import useMountLogger from "hooks/useMountLogger";
import { useAccount, useProvider } from "wagmi";
import { useDispatch } from "react-redux";
import useActionDispatch from "hooks/useActionDispatch";
import useDDContract from "hooks/useDDContract";
import { loadSystemSchedule, loadSystemStage } from "store/systemReducer";
import { EVENTS } from "consts";
import useOnConnect from "hooks/useOnConnect";
import { readAndWatchAccountTokens } from "store/tokensReducer";

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
      contract.on(EVENTS.StageChanged, (_stage) => {
        console.log("EVENT StageChanged fired", { _stage });
        dispatch(loadSystemStage(contract));
      });
    });

    return () => {
      contract.removeAllListeners();
    };
  }, []);

  useOnConnect(
    () => {
      dispatch(
        readAndWatchAccountTokens(
          actionDispatch,
          contract,
          provider,
          account?.address
        )
      );
    },
    () => {
      dispatch({ type: "RESET_STATE" });
    }
  );

  return null;
};

export default AppLoader;
