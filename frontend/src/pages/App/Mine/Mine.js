import React, {useEffect, useState} from "react";
import _ from 'lodash'
import useDDContract from "hooks/useDDContract";
import { utils as ethersUtils } from "ethers";
import classNames from "classnames";
import './Mine.scss'
import { useDispatch, useSelector } from "react-redux";
import {fetchPricing, systemSelector} from "store/systemReducer";
import VideoPlayer from "components/VideoPlayer";
import Countdown from 'components/Countdown';
import {loadAccountNfts, watchTokenMined} from "store/tokensReducer";
import { useAccount, useProvider } from "wagmi";
import useEffectWithAccount from "hooks/useEffectWithAccount";
import ActionButton from "components/ActionButton";
import {useNavigate} from "react-router-dom";
import {isActionSuccessSelector} from "components/ActionButton/ActionButton.module";

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
  const [completeVideoEnded, setCompleteVideoEnded] = useState(false)
  const [minedTokenId, setMinedTokenId] = useState(-1)
  const account = useAccount()
  const provider = useProvider();
  const contract = useDDContract()
  const dispatch = useDispatch()
  const [canMine, setCanMine] = useState(true)
  const navigate = useNavigate()
  const isFetchNftsSuccess = useSelector(isActionSuccessSelector('load-nfts'))

  useEffect(() => {
    dispatch(fetchPricing(contract))
  }, [])

  useEffectWithAccount(async () => {
    const isWhitelisted = await contract.mintAllowedAddresses(account.address)
    setCanMine(isWhitelisted)
  })

  useEffect(() => {
    if (completeVideoEnded && minedTokenId > -1 && isFetchNftsSuccess) {
      navigate(`/nft/${minedTokenId}`)
    }
  }, [completeVideoEnded, minedTokenId, isFetchNftsSuccess])

  const mine = async () => {
    watchTokenMined(provider, contract, account?.address, (tokenId) => {
      dispatch(loadAccountNfts(contract, provider, account.address))
      setMinedTokenId(tokenId)
    })

    const tx = await contract.mine({ value: minePrice })

    setShowCompleteVideo(true)

    const receipt = await tx.wait()

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

    console.log({ showVideo, showCompleteVideo, completeVideoEnded })

    if (showVideo) return (
      <>
        <div className="leading-text">THE MINE IS OPEN</div>
        <VideoPlayer onEnded={() => setShowVideo(false)}>02 - OPENING VIDEO</VideoPlayer>
      </>
    )

    if (showCompleteVideo || completeVideoEnded) return (
      <VideoPlayer onEnded={() => {
        setCompleteVideoEnded(true)
        setShowCompleteVideo(false)
      }}>03 - MINE VIDEO</VideoPlayer>
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
