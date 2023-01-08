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

const CollectorLoader = ({ contract, onDisconnect }) => {
  const actionDispatch = useActionDispatch();
  const isPending = useSelector(
    isActionPendingSelector("get-collector-by-address")
  );

  useOnConnect((address) => {
    if (!isPending) {
      actionDispatch(
        loadCollectorByAddress(address, contract),
        "get-collector-by-address"
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
