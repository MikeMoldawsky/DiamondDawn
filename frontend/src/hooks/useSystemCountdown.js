import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getStageName, isPrivateSale } from "utils";
import { systemSelector } from "store/systemReducer";
import { SYSTEM_STAGE } from "consts";

const getSystemCountdownText = (systemStage, isActive) => {
  if (
    (systemStage === SYSTEM_STAGE.DAWN && !isActive) ||
    systemStage === SYSTEM_STAGE.COMPLETED
  )
    return "";
  if (systemStage < SYSTEM_STAGE.KEY) return "THE PRIVATE SALE STARTS IN";
  if (systemStage === SYSTEM_STAGE.KEY && isActive) {
    return `${isPrivateSale() ? "PRIVATE" : "PUBLIC"} SALE ENDS IN`;
  }
  return isActive
    ? `${getStageName(systemStage)} CLOSES IN`
    : `${getStageName(systemStage + 1)} OPENS IN`;
};

const useSystemCountdown = () => {
  const { systemStage, isActive, config } = useSelector(systemSelector);
  const endTime = config.stageTime;

  return useMemo(() => {
    const countdownText = getSystemCountdownText(systemStage, isActive);
    return {
      countdownText,
      date: endTime,
      defaultParts: { days: 24, hours: 3, minutes: 0, seconds: 0 },
    };
  }, [systemStage, isActive, endTime]);
};

export default useSystemCountdown;
