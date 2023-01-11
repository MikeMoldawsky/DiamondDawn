import React from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { isNoContractMode } from "utils";
import { loadCollectorByAddress } from "store/collectorReducer";
import useActionDispatch from "hooks/useActionDispatch";
import { isActionPendingSelector } from "store/actionStatusReducer";
import useOnConnect from "hooks/useOnConnect";
import useDDContract from "hooks/useDDContract";
import ContractProvider from "containers/ContractProvider";
import { ACTION_KEYS } from "consts";

const CollectorLoader = ({ contract, onDisconnect }) => {
  const actionDispatch = useActionDispatch();
  const isPending = useSelector(
    isActionPendingSelector(ACTION_KEYS.GET_COLLECTOR_BY_ADDRESS)
  );

  useOnConnect((address) => {
    if (!isPending) {
      actionDispatch(
        loadCollectorByAddress(address, contract),
        ACTION_KEYS.GET_COLLECTOR_BY_ADDRESS
      );
    }
  }, onDisconnect);
};

const CollectorLoaderWithContract = () => {
  const contract = useDDContract();
  return <CollectorLoader contract={contract} />;
};

export default isNoContractMode()
  ? CollectorLoader
  : (props) => (
      <ContractProvider>
        <CollectorLoaderWithContract {...props} />
      </ContractProvider>
    );
