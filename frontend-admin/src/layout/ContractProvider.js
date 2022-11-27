import React from "react";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";

const ContractProvider = ({ children }) => {
  const { ddContractData, ddMineContractData } = useSelector(systemSelector);
  return ddContractData && ddMineContractData ? children : null;
};

export default ContractProvider;
