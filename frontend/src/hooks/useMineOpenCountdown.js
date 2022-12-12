import React, {useMemo} from "react";
import { useSelector } from "react-redux";
import {getStageName} from "utils";
import { systemSelector } from "store/systemReducer";
import { SYSTEM_STAGE } from "consts";

const getCountdownText = (systemStage, isActive) => {
  if ((systemStage === SYSTEM_STAGE.DAWN && !isActive) || systemStage === SYSTEM_STAGE.COMPLETED) return ""
  if (systemStage < SYSTEM_STAGE.KEY) return "THE PRIVATE SALE STARTS IN"
  if (systemStage === SYSTEM_STAGE.KEY && isActive) return "MINT ENDS IN"
  return isActive
    ? `${getStageName(systemStage)} CLOSES IN`
    : `${getStageName(systemStage + 1)} OPENS IN`
}

const useMineOpenCountdown = () => {
  const { systemStage, isActive, config } = useSelector(systemSelector);
  const endTime = config.stageTime;
  const countdownText = useMemo(() => getCountdownText(systemStage, isActive), [systemStage, isActive])

  if (!endTime) return {
    countdownText,
    parts: { days: 24, hours: 3, minutes: 0, seconds: 0 },
  }

  return { countdownText, date: endTime }
};

export default useMineOpenCountdown;
