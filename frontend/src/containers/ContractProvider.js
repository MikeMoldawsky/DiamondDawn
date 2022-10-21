import React from "react";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import Loading from "components/Loading";
import isEmpty from "lodash/isEmpty";

const ContractProvider = ({ children, withLoader, goThrough }) => {
  const { ddContractInfo } = useSelector(systemSelector);
  return !isEmpty(ddContractInfo) || goThrough ? (
    children
  ) : withLoader ? (
    <Loading />
  ) : null;
};

export default ContractProvider;
