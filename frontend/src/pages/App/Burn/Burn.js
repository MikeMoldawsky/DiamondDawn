import React, { useState } from "react";
import _ from 'lodash'
import Countdown from 'react-countdown';
import { showError } from "utils";
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import { useForm } from 'react-hook-form';
import './Burn.scss'
import classNames from "classnames";

const Burn = () => {
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

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

      setShowComplete(true)
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
    if (showComplete) {
      return (
        <div className="complete-view">
          <div className="leading-text">Complete</div>
        </div>
      )
    }
    return (
      <div className="action">
        {!showShippingForm
          ? (
            <div className="button action-button" onClick={() => setShowShippingForm(true)}>Burn NFT</div>
          )
          : (
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
        }
        <div className="countdown">
          <div className="countdown-text">Burn ends in:</div>
          <Countdown date={Date.now() + 10000} />
        </div>
      </div>
    )
  }

  return (
    <div className="action-view burn">
      {renderContent()}
    </div>
  )
}

export default Burn;
