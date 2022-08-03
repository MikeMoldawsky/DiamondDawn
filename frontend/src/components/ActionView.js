import React, {useEffect, useState} from "react";
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import VideoPlayer from "components/VideoPlayer";
import {loadAccountNfts} from "store/tokensReducer";
import { useAccount, useProvider } from "wagmi";
import {useNavigate} from "react-router-dom";
import {isActionSuccessSelector} from "components/ActionButton/ActionButton.module";
import Loading from "components/Loading";
import classNames from "classnames";

const ActionView = ({ children, className, videoUrl, watch, transact }) => {
  const [actionTxId, setActionTxId] = useState(false)
  const [showCompleteVideo, setShowCompleteVideo] = useState(false)
  const [completeVideoEnded, setCompleteVideoEnded] = useState(false)
  const [processedTokenId, setProcessedTokenId] = useState(-1)
  const account = useAccount()
  const provider = useProvider();
  const contract = useDDContract()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isFetchNftsSuccess = useSelector(isActionSuccessSelector('load-nfts'))

  useEffect(() => {
    if (completeVideoEnded && processedTokenId > -1 && isFetchNftsSuccess) {
      navigate(`/nft/${processedTokenId}`)
    }
  }, [completeVideoEnded, processedTokenId, isFetchNftsSuccess])

  const execute = async () => {
    watch(provider, contract, account.address, tokenId => {
      dispatch(loadAccountNfts(contract, provider, account.address))
      setProcessedTokenId(tokenId)
    })

    const tx = await transact()

    setShowCompleteVideo(true)

    const receipt = await tx.wait()

    setActionTxId(receipt.transactionHash)
  }

  const renderContent = () => {

    console.log({ showCompleteVideo, completeVideoEnded })

    if (showCompleteVideo) return (
      <VideoPlayer onEnded={() => {
        setCompleteVideoEnded(true)
        setShowCompleteVideo(false)
      }} src={videoUrl}>03 - MINE VIDEO</VideoPlayer>
    )

    if (completeVideoEnded) {
      return (<Loading />)
    }

    return React.cloneElement(children, { execute })
  }

  return (
    <div className={classNames("action-view", className)}>
      {renderContent()}
    </div>
  )
}

export default ActionView;
