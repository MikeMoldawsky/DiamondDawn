import React, {useEffect, useState} from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import ActionButton from "components/ActionButton";
import Countdown from "react-countdown";
import {updateStageTimeApi} from "api/serverApi";
import { useDispatch, useSelector } from "react-redux";
import {loadConfig, systemSelector, updateStageTime} from "store/systemReducer";
import classNames from "classnames";

const ConfigTab = () => {
  const dispatch = useDispatch();
  const { config } = useSelector(systemSelector);
  const { stageTime } = config
  const [displayStageTime, setDisplayStageTime] = useState(null);

  useEffect(() => {
    dispatch(loadConfig());
  }, [])

  const time = displayStageTime || stageTime

  const wasChanged = time && time !== stageTime

  return (
    <div className={classNames("tab-content config")}>
      <h1>Configuration</h1>
      <div className="stage-time">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="center-aligned-row input-row">
            <div className="caption">Stage Time</div>
            <div className="center-aligned-row">
              <DateTimePicker
                minDateTime={new Date()}
                value={time}
                onChange={setDisplayStageTime}
                renderInput={(params) => <TextField {...params} />}
              />
              <div className="countdown">
                {time ? <Countdown date={time} /> : <span>00:00:00:00</span>}
              </div>
            </div>
          </div>
        </LocalizationProvider>
        <div className="button-row">
          <ActionButton
            actionKey={`Save Stage Time`}
            className="save-button"
            onClick={() => dispatch(updateStageTime(displayStageTime))}
            disabled={!wasChanged}
          >
            SAVE
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default ConfigTab;
