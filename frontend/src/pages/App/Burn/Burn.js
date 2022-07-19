import React, { useState } from "react";
import _ from 'lodash'
import Countdown from 'components/Countdown';
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { fetchTokenUri, fetchAccountBurnedTokens, tokenByIdSelector } from "store/tokensReducer";
import { useForm } from 'react-hook-form';
import './Burn.scss'
import classNames from "classnames";
import { systemSelector } from "store/systemReducer";
import VideoPlayer from "components/VideoPlayer";
import NoDiamondView from "components/NoDiamondView";
import useSelectAvailableToken from "hooks/useSelectAvailableToken";
import { STAGE } from "consts";
import { useAccount } from "wagmi";
import Diamond from "components/Diamond";
import useEffectWithAccount from "hooks/useEffectWithAccount";
import ActionButton from "components/ActionButton";

const Burn = () => {
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { isStageActive, stageStartTimes } = useSelector(systemSelector)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [showCompleteVideo, setShowCompleteVideo] = useState(false)
  const [actionTxId, setActionTxId] = useState(false)
  const { data: account } = useAccount()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useSelectAvailableToken(STAGE.PHYSICAL)

  useEffectWithAccount(() => {
    dispatch(fetchAccountBurnedTokens(contract, account.address))
  })

  const saveAddressAndBurn = async (formData) => {
    // TODO - save shipping address off-chain
    const tx = await contract.burn(selectedTokenId)
    const receipt = await tx.wait()

    dispatch(fetchTokenUri(contract, selectedTokenId))
    setShowCompleteVideo(true)
    setActionTxId(receipt.transactionHash)
  }

  const renderInput = (name, placeholder) => {
    return (
      <div className="input-container">
        <input {...register(name, { required: true })} placeholder={placeholder} className={classNames({ 'validation-error': !_.isNil(_.get(errors, name)) })} />
      </div>
    )
  }

  const renderContent = () => {

    if (showCompleteVideo) return (
      <div onClick={() => setShowCompleteVideo(false)}>
        <VideoPlayer>05 - BURN VIDEO</VideoPlayer>
      </div>
    )

    const endTime = _.get(stageStartTimes, 4)

    const isTokenBurned = token?.stage === STAGE.PHYSICAL
    if (isTokenBurned) {
      return (
        <>
          <Diamond diamond={token} />
          <div className="leading-text">READY TO HOLD IT IN YOUR HAND?</div>
          <div className="secondary-text">A diamond's journey is eternal</div>
        </>
      )
    }

    if (showShippingForm) return (
      <>
        <div className="leading-text">ENTER A SHIPPING ADDRESS</div>
        <div className="secondary-text">We are committed to your privacy</div>
        <form>
          <div className="sbs-row">
            {renderInput('fullName', 'Full Name')}
            {renderInput('country', 'Country')}
          </div>
          <div className="sbs-row">
            {renderInput('city', 'City')}
            {renderInput('postalCode', 'Postal Code')}
          </div>
          {renderInput('address', 'Address')}
          <ActionButton actionKey="Burn" onClick={handleSubmit(saveAddressAndBurn)}>Burn and Ship</ActionButton>
        </form>
      </>
    )

    if (!token) return (<NoDiamondView stageName="burn" />)

    return (
      <>
        <Diamond diamond={token} />
        <div className="leading-text">BUT... IS THERE MORE?</div>
        <div className="secondary-text">Letting the perfect stone go can be a risk... but a diamond's journey is never over</div>
        {isStageActive && (
          <div className="button action-button" onClick={() => setShowShippingForm(true)}>Burn NFT</div>
        )}
        <Countdown date={endTime} text={['You have', `${isStageActive ? 'to' : 'until'} burn`]} />
      </>
    )
  }

  return (
    <div className="action-view burn">
      {renderContent()}
    </div>
  )
}

export default Burn;
