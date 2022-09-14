import React from "react";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import Loading from "components/Loading";

const ContractProvider = ({ children, withLoader }) => {
  const { ddContractInfo } = useSelector(systemSelector);
  return ddContractInfo ? children : withLoader ? <Loading /> : null;
};

export default ContractProvider;
