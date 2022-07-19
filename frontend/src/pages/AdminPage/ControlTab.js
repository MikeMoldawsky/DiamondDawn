import React, { useEffect, useState } from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { fetchStage, fetchPaused, systemSelector, getStageConfigs } from "store/systemReducer";
import useDDContract from "hooks/useDDContract";
import classNames from "classnames";
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

  const completeStage = async () => {
    const tx = await contract.completeCurrentStage()
    const receipt = await tx.wait()
    dispatch(fetchStage(contract))
  }

  const resetStage = async () => {
    const tx = await contract.dev__ResetStage()
    const receipt = await tx.wait()
    dispatch(fetchStage(contract))
  }

  const pause = async () => {
    const tx = await contract.pause()
    const receipt = await tx.wait()
    dispatch(fetchPaused(contract))
  }

  const unpause = async () => {
    const tx = await contract.unpause()
    const receipt = await tx.wait()
    dispatch(fetchPaused(contract))
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
        <ActionButton actionKey="Reveal Stage" onClick={revealStage}>Reveal Stage</ActionButton>
        <ActionButton actionKey="Complete Stage" onClick={completeStage}>Complete Stage</ActionButton>
        <ActionButton actionKey="Reset Stage" onClick={resetStage}>Reset Stage</ActionButton>
        <div className="separator" />
        <ActionButton actionKey="Pause" onClick={pause}>Pause</ActionButton>
        <ActionButton actionKey="Unpause" onClick={unpause}>Unpause</ActionButton>
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

export default ControlTab;
