import React from "react";
import { useSelector } from "react-redux";
import { isPrivateSale } from "utils";
import { systemSelector } from "store/systemReducer";
import { SYSTEM_STAGE } from "consts";

const useMineOpenCountdown = () => {
  const { config } = useSelector(systemSelector);
  return { date: config.stageTime };
};

export default useMineOpenCountdown;
