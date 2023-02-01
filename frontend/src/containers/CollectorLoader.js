import React from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { loadCollectorByAddress } from "store/collectorReducer";
import useActionDispatch from "hooks/useActionDispatch";
import { isActionPendingSelector } from "store/actionStatusReducer";
import useOnConnect from "hooks/useOnConnect";
import { ACTION_KEYS } from "consts";

const CollectorLoader = ({ onDisconnect }) => {
  const actionDispatch = useActionDispatch();
  const isPending = useSelector(
    isActionPendingSelector(ACTION_KEYS.GET_COLLECTOR_BY_ADDRESS)
  );

  useOnConnect((address) => {
    if (!isPending) {
      actionDispatch(
        loadCollectorByAddress(address),
        ACTION_KEYS.GET_COLLECTOR_BY_ADDRESS
      );
    }
  }, onDisconnect);
};

export default CollectorLoader;
