import React, { useState } from "react";
import Countdown from 'components/Countdown';
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { fetchTokenUri, tokenByIdSelector } from "store/tokensReducer";
import { systemSelector } from "store/systemReducer";
import VideoPlayer from "components/VideoPlayer";
import useSelectAvailableToken from "hooks/useSelectAvailableToken";
import { STAGE } from "consts";
import NoDiamondView from "components/NoDiamondView";
import Diamond from "components/Diamond";
import _ from "lodash";
import ActionButton from "components/ActionButton";
import {isTokenInStage} from "utils";

const Cut = () => {
  const [actionTxId, setActionTxId] = useState(false)
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { isStageActive, stageStartTimes } = useSelector(systemSelector)
  const [showCompleteVideo, setShowCompleteVideo] = useState(false)
  const dispatch = useDispatch()

  useSelectAvailableToken(STAGE.CUT)

  const cut = async () => {
    const tx = await contract.cut(selectedTokenId)

    setShowCompleteVideo(true)

    const receipt = await tx.wait()

    dispatch(fetchTokenUri(contract, selectedTokenId))
    setActionTxId(receipt.transactionHash)
  }

  const renderContent = () => {
    if (showCompleteVideo) return (
      <VideoPlayer onEnded={() => setShowCompleteVideo(false)}>04 - CUTTING VIDEO</VideoPlayer>
    )

    const endTime = _.get(stageStartTimes, 2)

    const isTokenCut = isTokenInStage(token, STAGE.CUT)
    if (isTokenCut) return (
      <>
        <Diamond diamond={token} />
        <div className="leading-text">YOUR CUT DIAMOND NFT IS IN YOUR WALLET</div>
        <Countdown date={endTime} text={['You have', 'until polish']} />
        <div className="secondary-text">Without darkness, nothing could be able to shine glamorously</div>
      </>
    )

    if (!token) return (<NoDiamondView stageName="cut" />)

    return (
      <>
        <Diamond diamond={token} />
        <div className="leading-text">
          EVERYBODY WANT TO BE A DIAMOND,<br/>
          BUT VERY FEW ARE WILLING TO CUT
        </div>
        <div className="secondary-text">Will you take the risk?</div>
        {isStageActive && (
          <ActionButton actionKey="Cut" className="action-button" onClick={cut}>CUT</ActionButton>
        )}
        <Countdown date={endTime} text={['You have', `${isStageActive ? 'to' : 'until'} cut`]} />
      </>
    )
  }

  return (
    <div className="action-view mine">
      {renderContent()}
    </div>
  )
}

export default Cut;
