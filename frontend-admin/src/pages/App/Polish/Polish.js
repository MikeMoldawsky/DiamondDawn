import React, { useState } from "react";
import Countdown from 'components/Countdown';
import useDDContract from "hooks/useDDContract";
import { BigNumber, utils as ethersUtils } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import { fetchTokenUri, tokenByIdSelector } from "store/tokensReducer";
import VideoPlayer from "components/VideoPlayer";
import useSelectAvailableToken from "hooks/useSelectAvailableToken";
import { STAGE } from "consts";
import NoDiamondView from "components/NoDiamondView";
import Diamond from "components/Diamond";
import _ from "lodash";
import ActionButton from "components/ActionButton";

const Polish = () => {
  const [actionTxId, setActionTxId] = useState(false)
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { polishPrice, isStageActive, stageStartTimes } = useSelector(systemSelector)
  const [showCompleteVideo, setShowCompleteVideo] = useState(false)
  const dispatch = useDispatch()

  useSelectAvailableToken(STAGE.POLISH)

  const polish = async () => {
    const tx = await contract.polish(selectedTokenId, { value: token.polishable ? BigNumber.from(0) : polishPrice })

    setShowCompleteVideo(true)

    const receipt = await tx.wait()

    dispatch(fetchTokenUri(contract, selectedTokenId))
    setActionTxId(receipt.transactionHash)
  }

  const renderContent = () => {

    if (showCompleteVideo) return (
      <VideoPlayer onEnded={() => setShowCompleteVideo(false)}>05 - POLISH VIDEO</VideoPlayer>
    )

    const endTime = _.get(stageStartTimes, 3)

    const isTokenPolished = token?.stage === STAGE.POLISH
    if (isTokenPolished) return (
      <>
        <Diamond diamond={token} />
        <div className="leading-text">YOUR PERFECT DIAMOND NFT IS IN YOUR WALLET</div>
        <Countdown date={endTime} text={['You have', 'until burn']} />
        <div className="secondary-text">Can it be real?</div>
      </>
    )

    if (!token) return (<NoDiamondView stageName="polish" />)

    return (
      <>
        <Diamond diamond={token} />
        <div className="leading-text">
          A GEM CANNOT BE POLISHED WITHOUT FRICTION,<br/>
          NOR MAN PERFECTED WITHOUT TRIALS
        </div>
        <div className="secondary-text">Discover the beauty, a billion years in the making</div>
        {isStageActive && (
          <ActionButton actionKey="Polish" className="action-button" onClick={polish}>POLISH{token.polishable ? '' : ` (${ethersUtils.formatUnits(polishPrice)} ETH)`}</ActionButton>
        )}
        <Countdown date={endTime} text={['You have', `${isStageActive ? 'to' : 'until'} polish`]} />
      </>
    )
  }

  return (
    <div className="action-view mine">
      {renderContent()}
    </div>
  )
}

export default Polish;
