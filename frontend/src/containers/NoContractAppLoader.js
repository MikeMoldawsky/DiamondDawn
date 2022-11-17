import { useEffect } from "react";
import useMountLogger from "hooks/useMountLogger";
import { useDispatch } from "react-redux";
import { loadConfig } from "store/systemReducer";
import useOnConnect from "hooks/useOnConnect";
import { loadCollectorByAddress } from "store/collectorReducer";
import useActionDispatch from "hooks/useActionDispatch";
import { clearActionStatus } from "store/actionStatusReducer";

const NoContractAppLoader = () => {
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

export default NoContractAppLoader;
