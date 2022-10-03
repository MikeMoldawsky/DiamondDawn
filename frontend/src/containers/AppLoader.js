import { useEffect } from "react";
import useMountLogger from "hooks/useMountLogger";
import { useAccount, useProvider } from "wagmi";
import { useDispatch } from "react-redux";
import useActionDispatch from "hooks/useActionDispatch";
import useDDContract from "hooks/useDDContract";
import { loadConfig, loadSystemStage } from "store/systemReducer";
import { EVENTS } from "consts";
import useOnConnect from "hooks/useOnConnect";
import { readAndWatchAccountTokens, clearTokens } from "store/tokensReducer";
import { useNavigate } from "react-router-dom";

const AppLoader = () => {
  const account = useAccount();
  const provider = useProvider();
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const contract = useDDContract();
  const navigate = useNavigate();

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
    () => {
      dispatch(clearTokens());
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
      navigate("/");
    }
  );

  return null;
};

export default AppLoader;
