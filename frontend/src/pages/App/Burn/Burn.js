import React, { useState } from "react";
import _ from 'lodash'
import Countdown from 'components/Countdown';
import { showError } from "utils";
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import { useForm } from 'react-hook-form';
import './Burn.scss'
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import { systemSelector } from "store/systemReducer";
import VideoPlayer from "components/VideoPlayer";

const Burn = () => {
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { isStageActive } = useSelector(systemSelector)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [showCompleteVideo, setShowCompleteVideo] = useState(false)
  const [actionTxId, setActionTxId] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!token) return null

  const saveAddressAndBurn = async (formData) => {
    try {
      console.log('saveAddressAndBurn', { formData })
      // TODO - save shipping address off-chain
      const tx = await contract.burn(selectedTokenId)
      const receipt = await tx.wait()

      setShowCompleteVideo(true)
      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      showError(e, 'Burn Failed')
    }
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

    const wasBurnt = !_.isEmpty(actionTxId)
    if (wasBurnt) {
      return (
        <>
          <div className="diamond-art">
            <FontAwesomeIcon icon={faGem} />
          </div>
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
          <div className="button" onClick={handleSubmit(saveAddressAndBurn)}>Burn and Ship</div>
        </form>
      </>
    )

    return (
      <>
        <div className="diamond-art">
          <FontAwesomeIcon icon={faGem} />
        </div>
        <div className="leading-text">BUT... IS THERE MORE?</div>
        <div className="secondary-text">Letting the perfect stone go can be a risk... but a diamond's journey is never over</div>
        {isStageActive && (
          <div className="button action-button" onClick={() => setShowShippingForm(true)}>Burn NFT</div>
        )}
        <Countdown date={Date.now() + 10000} text={['You have', `${isStageActive ? 'to' : 'until'} burn`]} />
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
