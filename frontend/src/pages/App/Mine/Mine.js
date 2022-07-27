import React, { useState } from "react";
import _ from 'lodash'
import useDDContract from "hooks/useDDContract";
import { utils as ethersUtils } from "ethers";
import classNames from "classnames";
import './Mine.scss'
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import VideoPlayer from "components/VideoPlayer";
import Countdown from 'components/Countdown';
import { loadAccountNfts } from "store/tokensReducer";
import { useAccount, useProvider } from "wagmi";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import { STAGE } from "consts";
import Diamond from "components/Diamond";
import useEffectWithAccount from "hooks/useEffectWithAccount";
import ActionButton from "components/ActionButton";
import { isTokenInStage } from "utils";

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
  const { minePrice, isStageActive, stageStartTimes } = useSelector(systemSelector)
  const [showVideo, setShowVideo] = useState(true)
  const [showCompleteVideo, setShowCompleteVideo] = useState(false)
  const account = useAccount()
  const provider = useProvider();
  const contract = useDDContract()
  const dispatch = useDispatch()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const [canMine, setCanMine] = useState(true)

  useEffectWithAccount(async () => {
    const isWhitelisted = await contract.mintAllowedAddresses(account.address)
    setCanMine(isWhitelisted)
  })

  const mine = async () => {
    const tx = await contract.mine({ value: minePrice })

    setShowCompleteVideo(true)

    const receipt = await tx.wait()

    dispatch(loadAccountNfts(contract, provider, account.address))
    setActionTxId(receipt.transactionHash)
  }

  const renderContent = () => {
    if (!isStageActive) {
      const startTime = _.get(stageStartTimes, 0)
      return (
        <>
          <VideoPlayer>01 - COMING SOON VIDEO</VideoPlayer>
          <Countdown date={startTime} text={['You have', 'until mining']} />
        </>
      )
    }

    const endTime = _.get(stageStartTimes, 1)

    if (showVideo) return (
      <>
        <div className="leading-text">THE MINE IS OPEN</div>
        <VideoPlayer onEnded={() => setShowVideo(false)}>02 - OPENING VIDEO</VideoPlayer>
      </>
    )

    if (showCompleteVideo) return (
      <VideoPlayer onEnded={() => setShowCompleteVideo(false)}>03 - MINE VIDEO</VideoPlayer>
    )

    const isTokenMined = isTokenInStage(token, STAGE.MINE)
    if (isTokenMined) return (
      <>
        <Diamond diamond={token} />
        <div className="leading-text">YOUR ROUGH DIAMOND NFT IS IN YOUR WALLET</div>
        <Countdown date={endTime} text={['You have', 'until cutting']} />
        <div className="secondary-text">But what lies beneath the surface</div>
      </>
    )

    if (!canMine) return (
      <div className="">
        <div className="leading-text">ADDRESS NOT ALLOWED TO MINE</div>
        <div className="button action-button">REQUEST WHITELIST</div>
        <Countdown date={endTime} text={['You have', 'to mine']} />
      </div>
    )

    return (
      <>
        <div className="leading-text">A DIAMONDS JOURNEY HAS MANY STEPS</div>
        <div className="secondary-text">The first one is to believe</div>
        <div className="center-aligned-row packages">
          <PackageBox selected={selectedPackage} select={setSelectedPackage} index={0} text="Mine" cost={minePrice} />
        </div>
        <div className="action">
          <ActionButton actionKey="Mine" className="action-button" onClick={mine}>MINE</ActionButton>
        </div>
        <Countdown date={endTime} text={['You have', 'to mine']} />
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
