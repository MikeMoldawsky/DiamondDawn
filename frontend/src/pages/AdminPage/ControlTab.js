import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStage, fetchPaused, systemSelector, getStageConfigs } from "store/systemReducer";
import useDDContract from "hooks/useDDContract";
import classNames from "classnames";
import ActionButton from "components/ActionButton";

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

  const completeAndRevealStage = async () => {
    if (artUrlInput === '') {
      setArtUrlError(true)
      return
    }
    setArtUrlError(false)
    const tx = await (isStageActive
      ? contract.completeCurrentStageAndRevealNextStage(artUrlInput)
      : contract.revealStage(artUrlInput))
    const receipt = await tx.wait()
    dispatch(fetchStage(contract))
    setArtUrlInput('')
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
        <ActionButton actionKey="Complete and Reveal Stage" onClick={completeAndRevealStage}>Next Stage</ActionButton>
        <ActionButton actionKey="Reset Stage" onClick={resetStage}>Reset Stage</ActionButton>
        <div className="separator" />
        <ActionButton actionKey="Pause" onClick={pause}>Pause</ActionButton>
        <ActionButton actionKey="Unpause" onClick={unpause}>Unpause</ActionButton>
      </div>
    </div>
  );
};

export default ControlTab;
