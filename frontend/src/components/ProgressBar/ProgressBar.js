import React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { systemSelector } from "store/systemReducer";
import "./ProgressBar.scss";

const steps = {
  MINE: 0,
  CUT: 1,
  POLISH: 2,
  BURN: 3,
};

const ProgressBar = () => {
  const { stage: systemStage, isStageActive } = useSelector(systemSelector);

  if ((systemStage === 0 && !isStageActive) || systemStage === 4) return null;

  return (
    <div className={classNames("progress-bar")}>
      {_.map(steps, (value, step) => {
        const isComplete = value < systemStage;
        const isInProgress = value === systemStage && isStageActive;
        return (
          <div
            key={`progress-bar-step-${value}`}
            className={classNames("progress-step", {
              complete: isComplete,
              active: isInProgress,
            })}
          >
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
