import React, { useEffect, useState } from "react";
import _ from 'lodash'
import { getStageConfigs } from "store/systemReducer";
import axios from "axios";
import { STAGE } from "consts";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import ActionButton from "components/ActionButton";

const updateStage = async (stage, startsAt) => {
  try {
    const res = await axios.post(`/api/update_stage`, { stage, startsAt })
    return res.data
  } catch (e) {
    return []
  }
}

const ScheduleTab = () => {

  const [stageStartTimes, setStageStartTimes] = useState({})

  const fetchStages = async () => {
    const stagesConfig = await getStageConfigs()
    setStageStartTimes(stagesConfig)
  }

  useEffect(() => {
    fetchStages()
  }, [])

  const onStartTimeChange = _stage => async _startTime => {
    setStageStartTimes({ ...stageStartTimes, [_stage]: _startTime })
  }

  const saveStage = async _stage => {
    return await updateStage(_stage, stageStartTimes[_stage])
  }

  return (
    <div className="admin-control">
      <h1>Stage Start Schedule</h1>
      <div className="stages" style={{ marginBottom: 40 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {_.map(STAGE, (_stage, _stageName) => {
            return (
              <div className="center-aligned-row stage-row">
                <span>{_stageName}</span>
                <div className="center-aligned-row inner-row">
                  <DateTimePicker
                    minDateTime={new Date()}
                    value={_.get(stageStartTimes, _stage, null)}
                    onChange={onStartTimeChange(_stage)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <ActionButton actionKey={`Save ${_stageName} Schedule`} className="btn-save" onClick={() => saveStage(_stage)}>Save</ActionButton>
                </div>
              </div>
            )
          })}
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default ScheduleTab;
