import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useDDContract from "hooks/useDDContract";
import ActionButton from "components/ActionButton";
import { getSystemStageName } from "utils";
import { SYSTEM_STAGE } from "consts";
import StageArt from "./StageArt";
import StageSchedule from "./StageSchedule";
import {loadSystemPaused, loadSystemStage, systemSelector} from "store/systemReducer";
import {pauseApi, setSystemStageApi, unpauseApi} from "api/contractApi";
import classNames from "classnames";

const StageTab = ({ stage }) => {
  const { systemStage, paused } = useSelector(systemSelector);
  const systemStageName = getSystemStageName(stage)

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

  return (
    <div className="stage-tab">
      <h1 className={classNames({ current: systemStage === stage })}>{systemStageName}</h1>
      <div className="title">{systemStageName} ART</div>
      <StageArt systemStage={stage} />
      <div className="separator" />
      <div className="title">{systemStageName} SCHEDULE</div>
      <StageSchedule stage={stage} />
      {stage === 0 && (
        <>
          <div className="separator" />
          <div className="title">IS PAUSED</div>
          <div className="center-aligned-row input-row">
            <div className="stage">{paused.toString()}</div>
            <ActionButton actionKey="togglePause" onClick={togglePause}>
              {paused ? "UNPAUSE" : "PAUSE"}
            </ActionButton>
          </div>
        </>
      )}
      <div className="separator" />
      <div className="center-aligned-row button-row">
        <ActionButton
          className="reveal-button"
          actionKey="Complete and Reveal Stage"
          disabled={stage === SYSTEM_STAGE.COMPLETE}
          onClick={() => setSystemStage(stage)}
        >
          REVEAL {systemStageName}
        </ActionButton>
      </div>
    </div>
  );
};

export default StageTab;
