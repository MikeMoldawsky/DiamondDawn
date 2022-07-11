import React, { useState } from "react";
import _ from 'lodash'
import { showError } from 'utils'
import useDDContract from "hooks/useDDContract";
import { utils as ethersUtils } from "ethers";
import classNames from "classnames";
import './Mine.scss'
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import VideoPlayer from "components/VideoPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import Countdown from 'components/Countdown';
import { loadAccountNfts, tokensSelector } from "store/tokensReducer";
import NoDiamondView from "components/NoDiamondView";
import { useAccount, useProvider } from "wagmi";

const PackageBox = ({ selected, select, index, text, cost }) => {
  return (
    <div className={classNames("package", { selected: selected === index })} onClick={() => select(index)}>
      <div className="package-content">
        <div>{text}</div>
        <div>{ethersUtils.formatUnits(cost)} ETH</div>
      </div>
    </div>
  )
}

const Mine = () => {
  const [actionTxId, setActionTxId] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(0)
  const { minePrice, mineAndCutPrice, fullPrice, isStageActive } = useSelector(systemSelector)
  const [showVideo, setShowVideo] = useState(true)
  const [showCompleteVideo, setShowCompleteVideo] = useState(false)
  const accountTokens = useSelector(tokensSelector)
  const { data: account } = useAccount()
  const provider = useProvider();
  const contract = useDDContract()
  const dispatch = useDispatch()

  const mine = async () => {
    try {
      let totalCost = minePrice
      if (selectedPackage === 1) {
        totalCost = mineAndCutPrice
      }
      else if (selectedPackage === 2) {
        totalCost = fullPrice
      }

      const tx = await contract.mine(selectedPackage, { value: totalCost })
      const receipt = await tx.wait()

      dispatch(loadAccountNfts(contract, provider, account.address))
      setShowCompleteVideo(true)
      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      showError(e, 'Mine Failed')
    }
  }

  const renderContent = () => {
    if (!isStageActive) return (
      <VideoPlayer>01 - COMING SOON VIDEO</VideoPlayer>
    )

    if (showVideo) return (
      <>
        <div className="leading-text">THE MINE IS OPEN</div>
        <div onClick={() => setShowVideo(false)}>
          <VideoPlayer>02 - OPENING VIDEO</VideoPlayer>
        </div>
      </>
    )

    if (showCompleteVideo) return (
      <div onClick={() => setShowCompleteVideo(false)}>
        <VideoPlayer>03 - MINE VIDEO</VideoPlayer>
      </div>
    )

    const wasMined = !_.isEmpty(actionTxId)
    if (wasMined) return (
      <>
        <div className="diamond-art">
          <FontAwesomeIcon icon={faGem} />
        </div>
        <div className="leading-text">YOUR ROUGH DIAMOND NFT IS IN YOUR WALLET</div>
        <Countdown date={Date.now() + 10000} text={['You have', 'until cutting']} />
        <div className="secondary-text">But what lies beneath the surface</div>
      </>
    )

    if (_.size(accountTokens) > 0) return (
      <NoDiamondView stageName="mine" secondaryText="Each account can mine only one diamond, you can buy more on OpenSea" />
    )

    return (
      <>
        <div className="leading-text">A DIAMONDS JOURNEY HAS MANY STEPS</div>
        <div className="secondary-text">The first one is to believe</div>
        <div className="center-aligned-row packages">
          <PackageBox selected={selectedPackage} select={setSelectedPackage} index={0} text="Mine" cost={minePrice} />
          <PackageBox selected={selectedPackage} select={setSelectedPackage} index={1} text="Mine and Cut" cost={mineAndCutPrice} />
          <PackageBox selected={selectedPackage} select={setSelectedPackage} index={2} text="Mine, Cut, Polish and Diamond" cost={fullPrice} />
        </div>
        <div className="action">
          <div className="button action-button" onClick={mine}>MINE</div>
        </div>
        <Countdown date={Date.now() + 10000} text={['You have', 'to mine']} />
      </>
    )
  }

  return (
    <div className="action-view mine">
      {renderContent()}
    </div>
  )
}

export default Mine;
