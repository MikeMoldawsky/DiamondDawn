import React, { useEffect, useState } from "react";
import _ from "lodash";
import { SYSTEM_STAGE } from "consts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import ActionButton from "components/ActionButton";
import Countdown from "react-countdown";
import { getSystemStageName } from "utils";
import { getSystemSchedule, updateSystemSchedule } from "api/serverApi";

const ScheduleTab = () => {
  const [schedule, setSchedule] = useState({});

  const fetchSchedule = async () => {
    setSchedule(await getSystemSchedule());
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const onStartTimeChange = (_stage) => async (_startTime) => {
    setSchedule({ ...schedule, [_stage]: _startTime });
  };

  const saveSchedule = async (_stage) => {
    return await updateSystemSchedule(_stage, schedule[_stage]);
  };

  return (
    <div className="admin-schedule">
      <h1>Stages Schedule</h1>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {_.map(SYSTEM_STAGE, (_stage) => {
          const value = _.get(schedule, _stage, null);
          return (
            <div
              key={`stage-schedule-${_stage}`}
              className="center-aligned-row stage-row"
            >
              <span className="caption">{getSystemStageName(_stage)}</span>
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
                  actionKey={`Save ${getSystemStageName(_stage)} Schedule`}
                  className="btn-save"
                  onClick={() => saveSchedule(_stage)}
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
