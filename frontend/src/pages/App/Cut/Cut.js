import React, { useState } from "react";
import Countdown from 'components/Countdown';
import { showError } from "utils";
import useDDContract from "hooks/useDDContract";
import { BigNumber, utils as ethersUtils } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { fetchTokenUri, tokenByIdSelector } from "store/tokensReducer";
import { systemSelector } from "store/systemReducer";
import VideoPlayer from "components/VideoPlayer";
import useSelectAvailableToken from "hooks/useSelectAvailableToken";
import { STAGE } from "consts";
import NoDiamondView from "components/NoDiamondView";
import Diamond from "components/Diamond";

const Cut = () => {
  const [actionTxId, setActionTxId] = useState(false)
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { cutPrice, isStageActive } = useSelector(systemSelector)
  const [showCompleteVideo, setShowCompleteVideo] = useState(false)
  const dispatch = useDispatch()

  useSelectAvailableToken(STAGE.CUT)

  const cut = async () => {
    try {
      const tx = await contract.cut(selectedTokenId, { value: token.cutable ? BigNumber.from(0) : cutPrice })
      const receipt = await tx.wait()

      dispatch(fetchTokenUri(contract, selectedTokenId))
      setShowCompleteVideo(true)
      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      showError(e, 'Cut Failed')
    }
  }

  const renderContent = () => {
    if (showCompleteVideo) return (
      <div onClick={() => setShowCompleteVideo(false)}>
        <VideoPlayer>04 - CUTTING VIDEO</VideoPlayer>
      </div>
    )

    const isTokenCut = token?.stage === STAGE.CUT
    if (isTokenCut) return (
      <>
        <Diamond diamond={token} />
        <div className="leading-text">YOUR CUT DIAMOND NFT IS IN YOUR WALLET</div>
        <Countdown date={Date.now() + 10000} text={['You have', 'until polish']} />
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
          <div className="button action-button" onClick={cut}>CUT{token.cutable ? '' : ` (${ethersUtils.formatUnits(cutPrice)} ETH)`}</div>
        )}
        <Countdown date={Date.now() + 10000} text={['You have', `${isStageActive ? 'to' : 'until'} cut`]} />
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
