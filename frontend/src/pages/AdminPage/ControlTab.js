import React, { useEffect, useState } from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { fetchStage, fetchPaused, systemSelector, getStageConfigs } from "store/systemReducer";
import { showError } from "utils";
import useDDContract from "hooks/useDDContract";
import classNames from "classnames";
import axios from "axios";
import { STAGE } from "consts";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';

const updateStage = async (stage, startsAt) => {
  try {
    const res = await axios.post(`/api/update_stage`, { stage, startsAt })
    return res.data
  } catch (e) {
    return []
  }
}

const ControlTab = () => {

  const { stage, isStageActive, paused } = useSelector(systemSelector)
  const [artUrlInput, setArtUrlInput] = useState('')
  const [artUrlError, setArtUrlError] = useState(false)
  const [stageStartTimes, setStageStartTimes] = useState({})

  console.log({ stageStartTimes })
  const contract = useDDContract()

  const dispatch = useDispatch()

  const fetchStages = async () => {
    const stagesConfig = await getStageConfigs()
    setStageStartTimes(stagesConfig)
  }

  useEffect(() => {
    dispatch(fetchStage(contract))
    dispatch(fetchPaused(contract))
    fetchStages()
  }, [])

  const revealStage = async () => {
    try {
      if (artUrlInput === '') {
        setArtUrlError(true)
        return
      }
      setArtUrlError(false)
      const tx = await contract.revealStage(artUrlInput)
      const receipt = await tx.wait()
      console.log('revealStage', { receipt })
      dispatch(fetchStage(contract))
      setArtUrlInput('')
    }
    catch (e) {
      showError(e, 'Reveal Stage Failed')
    }
  }

  const completeStage = async () => {
    try {
      const tx = await contract.completeCurrentStage()
      const receipt = await tx.wait()
      console.log('completeStage', { receipt })
      dispatch(fetchStage(contract))
    }
    catch (e) {
      showError(e, 'Complete Stage Failed')
    }
  }

  const resetStage = async () => {
    try {
      const tx = await contract.dev__ResetStage()
      const receipt = await tx.wait()
      console.log('resetStage', { receipt })
      dispatch(fetchStage(contract))
    }
    catch (e) {
      showError(e, 'Reset Stage Failed')
    }
  }

  const pause = async () => {
    try {
      const tx = await contract.pause()
      const receipt = await tx.wait()
      console.log('pause', { receipt })
      dispatch(fetchPaused(contract))
    }
    catch (e) {
      showError(e, 'Pause Failed')
    }
  }

  const unpause = async () => {
    try {
      const tx = await contract.unpause()
      const receipt = await tx.wait()
      console.log('unpause', { receipt })
      dispatch(fetchPaused(contract))
    }
    catch (e) {
      showError(e, 'Unpause Failed')
    }
  }

  const onStartTimeChange = _stage => async _startTime => {
    setStageStartTimes({ ...stageStartTimes, [_stage]: _startTime })
  }

  const saveStage = async _stage => {
    return await updateStage(_stage, stageStartTimes[_stage])
  }

  return (
    <div className="admin-control">
      <h1>Control Panel</h1>
      <div>
        <div className="center-aligned-row" style={{ width: 360, marginBottom: 30 }}>
          <div className="stage">STAGE: {stage}</div>
          <div className="stage">ACTIVE: {isStageActive.toString()}</div>
          <div className="stage">PAUSED: {paused.toString()}</div>
        </div>
      </div>
      <div className="actions">
        <div className="input-container">
          <input type="text" placeholder="Video Url" value={artUrlInput} onChange={e => setArtUrlInput(e.target.value)} className={classNames({ 'validation-error': artUrlError })} />
        </div>
        <div className="button" onClick={revealStage}>Reveal Stage</div>
        <div className="button" onClick={completeStage}>Complete Stage</div>
        <div className="button" onClick={resetStage}>Reset Stage</div>
        <div className="separator" />
        <div className="button" onClick={pause}>Pause</div>
        <div className="button" onClick={unpause}>Unpause</div>
      </div>
      <div className="separator" />
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
                  <div className="button btn-save" onClick={() => saveStage(_stage)}>Save</div>
                </div>
              </div>
            )
          })}
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default ControlTab;
