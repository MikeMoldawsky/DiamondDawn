import React, { useState } from "react";
import _ from 'lodash'
import Countdown from 'components/Countdown';
import { showError } from "utils";
import useDDContract from "hooks/useDDContract";
import { BigNumber, utils as ethersUtils } from "ethers";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import VideoPlayer from "components/VideoPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";

const Polish = () => {
  const [actionTxId, setActionTxId] = useState(false)
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { polishPrice, isStageActive } = useSelector(systemSelector)
  const [showCompleteVideo, setShowCompleteVideo] = useState(false)

  const polish = async () => {
    try {
      const tx = await contract.polish(selectedTokenId, { value: token.polishable ? BigNumber.from(0) : polishPrice })
      const receipt = await tx.wait()

      setShowCompleteVideo(true)
      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      showError(e, 'Polish Failed')
    }
  }

  const renderContent = () => {
    if (showCompleteVideo) return (
      <div onClick={() => setShowCompleteVideo(false)}>
        <VideoPlayer>05 - POLISH VIDEO</VideoPlayer>
      </div>
    )

    const wasPolished = !_.isEmpty(actionTxId)
    if (wasPolished) return (
      <>
        <div className="diamond-art">
          <FontAwesomeIcon icon={faGem} />
        </div>
        <div className="leading-text">YOUR PERFECT DIAMOND NFT IS IN YOUR WALLET</div>
        <Countdown date={Date.now() + 10000} text={['You have', 'until burn']} />
        <div className="secondary-text">Can it be real?</div>
      </>
    )

    return (
      <>
        <div className="diamond-art">
          <FontAwesomeIcon icon={faGem} />
        </div>
        <div className="leading-text">
          A GEM CANNOT BE POLISHED WITHOUT FRICTION,<br/>
          NOR MAN PERFECTED WITHOUT TRIALS
        </div>
        <div className="secondary-text">Discover the beauty, a billion years in the making</div>
        {isStageActive ? (
          <div className="button action-button" onClick={polish}>POLISH{token.polishable ? '' : ` (${ethersUtils.formatUnits(polishPrice)} ETH)`}</div>
        ) : (
          <Countdown date={Date.now() + 10000} text={['You have', 'until polish']} />
        )}
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
