import React, { useEffect, useState } from "react";
import _ from "lodash";
import { STAGE } from "consts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import ActionButton from "components/ActionButton";
import Countdown from "react-countdown";
import { getStageName } from "utils";
import { getStagesSchedule, updateStageSchedule } from "api/serverApi";

const getStageCaption = (stage) => {
  switch (stage) {
    case STAGE.REBIRTH:
      return "Burn End";
    default:
      return `${getStageName(stage)} Start`;
  }
};

const ScheduleTab = () => {
  const [stageStartTimes, setStageStartTimes] = useState({});

  const fetchStages = async () => {
    const stagesConfig = await getStagesSchedule();
    setStageStartTimes(stagesConfig);
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const onStartTimeChange = (_stage) => async (_startTime) => {
    setStageStartTimes({ ...stageStartTimes, [_stage]: _startTime });
  };

  const saveStage = async (_stage) => {
    return await updateStageSchedule(_stage, stageStartTimes[_stage]);
  };

  return (
    <div className="admin-schedule">
      <h1>Stages Schedule</h1>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {_.map(STAGE, (_stage) => {
          const value = _.get(stageStartTimes, _stage, null);
          return (
            <div
              key={`stage-schedule-${_stage}`}
              className="center-aligned-row stage-row"
            >
              <span className="caption">{getStageCaption(_stage)}</span>
              <div className="center-aligned-row inner-row">
                <DateTimePicker
                  minDateTime={new Date()}
                  value={value}
                  onChange={onStartTimeChange(_stage)}
                  renderInput={(params) => <TextField {...params} />}
                />
                <div className="countdown">
                  {value ? (
                    <Countdown date={value} />
                  ) : (
                    <span>00:00:00:00</span>
                  )}
                </div>
                <ActionButton
                  actionKey={`Save ${getStageName(_stage)} Schedule`}
                  className="btn-save"
                  onClick={() => saveStage(_stage)}
                >
                  Save
                </ActionButton>
              </div>
            </div>
          );
        })}
      </LocalizationProvider>
    </div>
  );
};

export default ScheduleTab;
