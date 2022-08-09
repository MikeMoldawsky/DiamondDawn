import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadContractInfo, systemSelector } from "store/systemReducer";
import Loading from "components/Loading";

const ContractProvider = ({ children, withLoader }) => {
  const { ddContractInfo } = useSelector(systemSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ddContractInfo) {
      dispatch(loadContractInfo());
    }
  }, [ddContractInfo, dispatch]);

  return ddContractInfo ? children : withLoader ? <Loading /> : null;
};

export default ContractProvider;
