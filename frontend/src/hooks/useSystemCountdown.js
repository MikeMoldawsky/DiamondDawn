import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getStageName, isPrivateSale } from "utils";
import { systemSelector } from "store/systemReducer";
import { SYSTEM_STAGE } from "consts";

export const COUNTDOWN_PHASES = {
  NONE: -1,
  BEFORE_MINT: 0,
  PRIVATE_SALE: 1,
  STAGE_ACTIVE: 2,
  STAGE_COOLDOWN: 3,
};

const getCountdownPhase = (systemStage, isActive, isMintOpen) => {
  if (
    (systemStage === SYSTEM_STAGE.DAWN && !isActive) ||
    systemStage === SYSTEM_STAGE.COMPLETED
  )
    return COUNTDOWN_PHASES.NONE;
  if (systemStage < SYSTEM_STAGE.KEY || !isMintOpen)
    return COUNTDOWN_PHASES.BEFORE_MINT;
  if (systemStage === SYSTEM_STAGE.KEY && isActive)
    return COUNTDOWN_PHASES.PRIVATE_SALE;

  return isActive
    ? COUNTDOWN_PHASES.STAGE_ACTIVE
    : COUNTDOWN_PHASES.STAGE_COOLDOWN;
};

const getSystemCountdownText = (phase, systemStage) => {
  switch (phase) {
    case COUNTDOWN_PHASES.BEFORE_MINT:
      return {
        countdownText: "THE PRIVATE SALE STARTS IN",
      };
    case COUNTDOWN_PHASES.PRIVATE_SALE:
      return {
        countdownText: "THE PRIVATE SALE ENDS IN",
        defaultParts: { days: 7, hours: 0, minutes: 0, seconds: 0 },
      };
    case COUNTDOWN_PHASES.STAGE_ACTIVE:
      return {
        countdownText: `${getStageName(systemStage)} CLOSES IN`,
      };
    case COUNTDOWN_PHASES.STAGE_COOLDOWN:
      return {
        countdownText: `${getStageName(systemStage)} OPENS IN`,
        defaultParts: { days: 3, hours: 3, minutes: 3, seconds: 0 },
      };
  }
};

const useSystemCountdown = () => {
  const { systemStage, isActive, config, isMintOpen } =
    useSelector(systemSelector);
  const endTime = config.stageTime;
  const countdownPhase = useMemo(
    () => getCountdownPhase(systemStage, isActive, isMintOpen),
    [systemStage, isActive, endTime]
  );

  return useMemo(() => {
    const { countdownText, defaultParts } = getSystemCountdownText(
      countdownPhase,
      systemStage
    );
    return {
      countdownPhase,
      countdownText,
      date: endTime,
      defaultParts: defaultParts || {
        days: 24,
        hours: 3,
        minutes: 0,
        seconds: 0,
      },
    };
  }, [countdownPhase, endTime]);
};

export default useSystemCountdown;
