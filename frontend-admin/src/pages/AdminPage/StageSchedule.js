import React, { useEffect, useState } from "react";
import _ from "lodash";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import ActionButton from "components/ActionButton";
import Countdown from "react-countdown";
import { getSystemStageName } from "utils";
import { getSystemScheduleApi, updateSystemScheduleApi } from "api/serverApi";
import rdiff from "recursive-diff";
import { useDispatch, useSelector } from "react-redux";
import { loadSchedule, systemSelector } from "store/systemReducer";

const StageSchedule = ({ stage }) => {
  const dispatch = useDispatch();
  const { schedule: dbSchedule } = useSelector(systemSelector);
  const [schedule, setSchedule] = useState({});

  const fetchSchedule = async () => {
    const systemSchedule = await getSystemScheduleApi();
    setSchedule(systemSchedule);
  };

  useEffect(() => {
    if (stage > -1) {
      fetchSchedule();
    }
  }, [stage]);

  const onStartTimeChange = (_stage) => async (_startTime) => {
    setSchedule({ ...schedule, [_stage]: _startTime });
  };

  const saveSchedule = async () => {
    await updateSystemScheduleApi(stage + 1, schedule[stage + 1]);
    if (stage > 0) {
      await updateSystemScheduleApi(stage, schedule[stage]);
    }
    dispatch(loadSchedule());
  };

  const renderRow = (_stage, caption) => {
    const value = _.get(schedule, _stage, null);

    return (
      <div className="center-aligned-row input-row">
        <div className="caption">{caption}</div>
        <div className="center-aligned-row">
          <DateTimePicker
            minDateTime={new Date()}
            value={value}
            onChange={onStartTimeChange(_stage)}
            renderInput={(params) => <TextField {...params} />}
          />
          <div className="countdown">
            {value ? <Countdown date={value} /> : <span>00:00:00:00</span>}
          </div>
        </div>
      </div>
    );
  };

  const getStageTimes = (times) =>
    _.pick(times, stage > 0 ? [stage, stage + 1] : [stage + 1]);

  const diff = rdiff.getDiff(
    getStageTimes(dbSchedule),
    getStageTimes(schedule)
  );

  return (
    <div className="stage-schedule">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {stage > 0 && renderRow(stage, "START")}
        {renderRow(stage + 1, "END")}
      </LocalizationProvider>
      <div className="button-row">
        <ActionButton
          actionKey={`Save ${getSystemStageName(stage)} Schedule`}
          className="save-button"
          onClick={() => saveSchedule()}
          disabled={_.isEmpty(diff)}
        >
          SAVE
        </ActionButton>
      </div>
    </div>
  );
};

export default StageSchedule;
