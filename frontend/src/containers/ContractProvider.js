import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadContractInfo, systemSelector } from "store/systemReducer";
import Loading from "components/Loading";
import useActionDispatch from "hooks/useActionDispatch";
import { isActionPendingSelector } from "components/ActionButton";

const ContractProvider = ({ children, withLoader }) => {
  const { ddContractInfo } = useSelector(systemSelector);
  const actionDispatch = useActionDispatch();
  const isPending = useSelector(isActionPendingSelector("get-contract"));

  useEffect(() => {
    if (!ddContractInfo && !isPending) {
      actionDispatch(loadContractInfo(), "get-contract");
    }
  }, [ddContractInfo, isPending]);

  return ddContractInfo ? children : withLoader ? <Loading /> : null;
};

export default ContractProvider;
