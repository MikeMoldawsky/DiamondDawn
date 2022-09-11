import React from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import useDDContract from "hooks/useDDContract";
import ActionButton from "components/ActionButton";
import { getSystemStageName } from "utils";
import StageArt from "./StageArt";
import StageSchedule from "./StageSchedule";
import {
  loadSystemPaused,
  loadSystemStage,
  systemSelector,
} from "store/systemReducer";
import {
  pauseApi,
  setSystemStageApi,
  completeStageApi,
  unpauseApi,
} from "api/contractApi";
import classNames from "classnames";
import { SYSTEM_STAGE } from "consts";

const StageTab = ({ stage }) => {
  const {
    systemStage,
    isStageActive,
    paused,
    maxDiamonds,
    diamondCount,
    schedule,
    videoArt,
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
  };

  const completeStage = async () => {
    await completeStageApi(contract, systemStage);
    dispatch(loadSystemStage(contract));
  };

  const startTime = _.get(schedule, stage);
  const isStartTimeSet = startTime && new Date(startTime) > new Date();
  const endTime = _.get(schedule, stage + 1);
  const isEndTimeSet = endTime && new Date(endTime) > new Date();
  const isScheduleSet =
    stage === 0 ? isEndTimeSet : isStartTimeSet && isEndTimeSet;
  const isVideoArtSet = _.every(videoArt, (videoUrl) => !_.isEmpty(videoUrl));
  const isCurrentStage = systemStage === stage;

  let canReveal = isScheduleSet && isVideoArtSet;
  if (stage === SYSTEM_STAGE.INVITE) {
    canReveal = canReveal && !paused;
  } else if (stage === SYSTEM_STAGE.MINE) {
    canReveal = canReveal && diamondCount === maxDiamonds;
  }

  return (
    <div className="stage-tab">
      <h1
        className={classNames({
          current: isCurrentStage,
          complete: isCurrentStage && !isStageActive,
        })}
      >
        {systemStageName}
      </h1>
      <div
        className={classNames("title", {
          success: isVideoArtSet,
          error: !isVideoArtSet,
        })}
      >
        {systemStageName} ART
      </div>
      <StageArt systemStage={stage} />
      <div className="separator" />
      <div
        className={classNames("title", {
          success: isScheduleSet,
          error: !isScheduleSet,
        })}
      >
        {systemStageName} SCHEDULE
      </div>
      <StageSchedule stage={stage} />
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
