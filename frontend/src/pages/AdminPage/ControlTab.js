import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStage, systemSelector } from "store/systemReducer";
import { showError } from "utils";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { STAGE } from "consts";
import useDDContract from "hooks/useDDContract";

const VIDEO_BY_STAGE = {
  [STAGE.MINE]: 'rough.jpeg',
  [STAGE.CUT]: 'cut.mp4',
  [STAGE.POLISH]: 'polish.mp4',
  [STAGE.PHYSICAL]: 'burn.mp4',
  [STAGE.REBIRTH]: 'final.mp4',
}

const ControlTab = () => {

  const { stage, isStageActive } = useSelector(systemSelector)
  const { selectedTokenId } = useSelector(uiSelector)

  const contract = useDDContract()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchStage(contract))
  }, [])

  const revealStage = async () => {
    try {
      const tx = await contract.revealStage(VIDEO_BY_STAGE[stage])
      const receipt = await tx.wait()
      console.log('revealStage', { receipt })
      dispatch(fetchStage(contract))
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
      dispatch(fetchStage(contract))    }
    catch (e) {
      showError(e, 'Reset Stage Failed')
    }
  }

  const pause = async () => {
    try {
      const tx = await contract.pause()
      const receipt = await tx.wait()
      console.log('pause', { receipt })
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
    }
    catch (e) {
      showError(e, 'Unpause Failed')
    }
  }

  const nextTokenId = () => {
    dispatch(setSelectedTokenId(selectedTokenId + 1))
  }

  return (
    <div className="admin-control">
      <h1>Control Panel</h1>
      <div>
        <div className="center-aligned-row" style={{ width: 200 }}>
          <div className="stage">STAGE: {stage}</div>
          <div className="stage">ACTIVE: {isStageActive.toString()}</div>
        </div>
      </div>
      <div className="actions">
        <div className="button" onClick={revealStage}>Reveal Stage</div>
        <div className="button" onClick={completeStage}>Complete Stage</div>
        <div className="button" onClick={resetStage}>Reset Stage</div>
        <div className="button" onClick={pause}>Pause</div>
        <div className="button" onClick={unpause}>Unpause</div>
      </div>
      <div className="token-section">
        <div className="stage">TOKEN ID: {selectedTokenId}</div>
        <div className="button" onClick={nextTokenId}>Next Token ID</div>
      </div>
    </div>
  );
};

export default ControlTab;
