import React from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import useDDContract from "hooks/useDDContract";
import ActionButton from "components/ActionButton";
import { getSystemStageName } from "utils";
import StageArt from "./StageArt";
import {
  loadSystemPaused,
  loadSystemStage,
  systemSelector, updateStageTime,
} from "store/systemReducer";
import {
  pauseApi,
  setSystemStageApi,
  completeStageApi,
  unpauseApi,
} from "api/contractApi";
import classNames from "classnames";
import { SYSTEM_STAGE } from "consts";
import add from 'date-fns/add'
import Countdown from "react-countdown";

const StageTab = ({ stage }) => {
  const {
    systemStage,
    isStageActive,
    paused,
    maxDiamonds,
    diamondCount,
    videoArt,
    config,
  } = useSelector(systemSelector);
  const systemStageName = getSystemStageName(stage);

  const contract = useDDContract();

  const dispatch = useDispatch();

  const togglePause = async () => {
    await (paused ? unpauseApi(contract) : pauseApi(contract));
    dispatch(loadSystemPaused(contract));
  };

  const setSystemStage = async (systemStage) => {
    await setSystemStageApi(contract, systemStage);
    dispatch(loadSystemStage(contract));
    const timestamp = add(new Date(), { weeks: 3, days: 3, hours: 3 })
    dispatch(updateStageTime(timestamp))
  };

  const completeStage = async () => {
    await completeStageApi(contract, systemStage);
    dispatch(loadSystemStage(contract));
    const timestamp = add(new Date(), { days: 3 })
    dispatch(updateStageTime(timestamp))
  };

  const isVideoArtSet = _.every(videoArt, (videoUrl) => !_.isEmpty(videoUrl));
  const isCurrentStage = stage === systemStage;
  const isNextStage = stage === systemStage + 1;

  let canReveal = isVideoArtSet;
  if (stage === SYSTEM_STAGE.INVITE) {
    canReveal = canReveal && !paused;
  } else if (stage === SYSTEM_STAGE.MINE) {
    canReveal = canReveal && diamondCount === maxDiamonds;
  }

  const renderCountdown = () => {
    let text = ''
    if (isCurrentStage) {
      text = `${isStageActive ? 'Stage' : 'Cooldown'} ends in `
    }

    if (isNextStage && !isStageActive) {
      text = 'Stage starts in '
    }

    return text ? (
      <div className="countdown">
        {text}<Countdown text={[]} date={config.stageTime} />
      </div>
    ) : null
  }

  return (
    <div className="stage-tab">
      <div className="center-aligned-row" style={{marginTop: 20}}>
        <h1
          className={classNames({
            current: isCurrentStage,
            complete: isCurrentStage && !isStageActive,
          })}
        >
          {systemStageName}
        </h1>
        {renderCountdown()}
      </div>
      <div
        className={classNames("title", {
          success: isVideoArtSet,
          error: !isVideoArtSet,
        })}
      >
        {systemStageName} ART
      </div>
      <StageArt systemStage={stage} />
      {stage === SYSTEM_STAGE.INVITE && (
        <>
          <div className="separator" />
          <div
            className={classNames("title", { success: !paused, error: paused })}
          >
            IS PAUSED
          </div>
          <div className="center-aligned-row input-row">
            <div className="stage">{paused.toString()}</div>
            <ActionButton actionKey="togglePause" onClick={togglePause}>
              {paused ? "UNPAUSE" : "PAUSE"}
            </ActionButton>
          </div>
        </>
      )}
      {stage === SYSTEM_STAGE.MINE && (
        <>
          <div className="separator" />
          <div
            className={classNames("title", {
              success: diamondCount === maxDiamonds,
              error: diamondCount !== maxDiamonds,
            })}
          >
            POPULATED DIAMOND COUNT
          </div>
          <div className="center-aligned-row input-row">
            <div className="stage">
              {diamondCount} / {maxDiamonds}
            </div>
          </div>
        </>
      )}
      <div className="separator" />
      <div className="center-aligned-row button-row main-button-row">
        <ActionButton
          className="reveal-button"
          actionKey="Reveal Stage"
          disabled={stage === systemStage || !canReveal}
          onClick={() => setSystemStage(stage)}
        >
          REVEAL {systemStageName}
        </ActionButton>
        <ActionButton
          className="reveal-button"
          actionKey="Complete Stage"
          disabled={stage !== systemStage || !isStageActive}
          onClick={() => completeStage(stage)}
        >
          COMPLETE {systemStageName}
        </ActionButton>
      </div>
    </div>
  );
};

export default StageTab;
