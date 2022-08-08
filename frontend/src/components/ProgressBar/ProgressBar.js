import React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { systemSelector } from "store/systemReducer";
import "./ProgressBar.scss";
import { SYSTEM_STAGE } from "consts";

const ProgressBar = () => {
  const { systemStage } = useSelector(systemSelector);

  if (systemStage === SYSTEM_STAGE.COMPLETE) return null;

  return (
    <div className={classNames("progress-bar")}>
      {_.map(SYSTEM_STAGE, (stage, stageName) => {
        const isStageComplete = stage < systemStage;
        const isStageInProgress = stage === systemStage;
        return (
          <div
            key={`progress-bar-step-${stage}`}
            className={classNames("progress-step", {
              complete: isStageComplete,
              active: isStageInProgress,
            })}
          >
            <span>{stageName}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
