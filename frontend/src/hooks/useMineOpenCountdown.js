import React from "react";
import { useSelector } from "react-redux";
import { isPrivateSale } from "utils";
import { systemSelector } from "store/systemReducer";
import { SYSTEM_STAGE } from "consts";

const useMineOpenCountdown = () => {
  const { systemStage, isActive, config } = useSelector(systemSelector);
  const endTime = config.stageTime;

  return isPrivateSale() || systemStage !== SYSTEM_STAGE.KEY || !isActive
      ? { parts: { days: 24, hours: 3, minutes: 0, seconds: 0 } }
      : { date: endTime };
};

export default useMineOpenCountdown;
