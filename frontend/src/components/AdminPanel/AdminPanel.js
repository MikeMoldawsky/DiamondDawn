import React, { useEffect } from "react";
import './AdminPanel.scss'
import { useDispatch, useSelector } from "react-redux";
import { fetchStage, setStage, systemSelector } from "store/systemReducer";
import contractAddress from "contracts/contract-address.json";
import ddContract from "contracts/DiamondDawn.json"
import { useContract, useProvider, useSigner } from "wagmi";
import { showError } from "utils";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";

const AdminPanel = () => {

  const { stage, isStageActive } = useSelector(systemSelector)
  const { selectedTokenId } = useSelector(uiSelector)

  const provider = useProvider()
  const { data: signer } = useSigner()

  const contractConfig = {
    addressOrName: contractAddress.DiamondDawn,
    contractInterface: ddContract.abi,
    signerOrProvider: signer || provider,
  }

  const contract = useContract(contractConfig)

  const dispatch = useDispatch()

  const revealStage = async () => {
    try {
      const tx = await contract.revealStage('')
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
    <div className="admin-panel">
      <div>
        <div className="title">Admin Panel</div>
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

export default AdminPanel;
