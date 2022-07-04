import React, { useEffect } from "react";
import './AdminPanel.scss'
import { useDispatch, useSelector } from "react-redux";
import { setStage, systemSelector } from "store/systemReducer";
import contractAddress from "contracts/contract-address.json";
import ddContract from "contracts/DiamondDawn.json"
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import {
  chain,
  configureChains,
  createClient,
  infuraRpcUrls,
  WagmiConfig,
  defaultChains, useContract, useAccount, useBalance, useProvider, useContractWrite, useSigner
} from "wagmi";
import { parseError } from 'utils'

const AdminPanel = () => {

  const { stage, isStageActive } = useSelector(systemSelector)

  const provider = useProvider()
  const { data: signer } = useSigner()

  console.log({ signer })

  const contractConfig = {
    addressOrName: contractAddress.DiamondDawn,
    contractInterface: ddContract.abi,
    signerOrProvider: signer || provider,
  }

  const contract = useContract(contractConfig)

  const dispatch = useDispatch()

  const loadData = async () => {
    const _stage = await contract.stage()
    const _isStageActive = await contract.isStageActive()
    dispatch(setStage(_stage, _isStageActive))
  }

  const revealStage = async () => {
    try {
      const tx = await contract.revealStage('')
      const receipt = await tx.wait()
      console.log('revealStage', { receipt })
      loadData()
    }
    catch (e) {
      console.error('revealStage', parseError(e))
    }
  }

  const completeStage = async () => {
    try {
      const tx = await contract.completeCurrentStage()
      const receipt = await tx.wait()
      console.log('completeStage', { receipt })
      loadData()
    }
    catch (e) {
      console.error('completeStage', parseError(e))
    }
  }

  const resetStage = async () => {
    try {
      const tx = await contract.dev__ResetStage()
      const receipt = await tx.wait()
      console.log('resetStage', { receipt })
      loadData()
    }
    catch (e) {
      console.error('resetStage', parseError(e))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

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
      </div>
    </div>
  );
};

export default AdminPanel;
