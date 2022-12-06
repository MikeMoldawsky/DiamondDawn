import React, { useCallback, useState } from "react";
import _ from "lodash";
import Countdown from "components/Countdown";
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import { useForm } from "react-hook-form";
import "./Ship.scss";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import ActionView from "components/ActionView";
import { shipApi } from "api/contractApi";
import DiamondPicker from "components/DiamondPicker";
import { getCDNVideoUrl } from "utils";

const Ship = () => {
  const contract = useDDContract();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));
  const [showShippingForm, setShowShippingForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const renderInput = (name, placeholder) => {
    return (
      <div className="input-container">
        <input
          {...register(name, { required: true })}
          placeholder={placeholder}
          className={classNames({
            "validation-error": !_.isNil(_.get(errors, name)),
          })}
        />
      </div>
    );
  };

  const BurnContent = useCallback(
    ({ execute, endTime }) => {
      if (showShippingForm)
        return (
          <>
            <DiamondPicker disabled />
            <div className="leading-text">ENTER A SHIPPING ADDRESS</div>
            <div className="tagline-text">We are committed to your privacy</div>
            <form>
              <div className="sbs-row">
                {renderInput("fullName", "Full Name")}
                {renderInput("country", "Country")}
              </div>
              <div className="sbs-row">
                {renderInput("city", "City")}
                {renderInput("postalCode", "Postal Code")}
              </div>
              {renderInput("address", "Address")}
              <ActionButton actionKey="Burn" onClick={handleSubmit(execute)}>
                Burn and Ship
              </ActionButton>
            </form>
          </>
        );

      return (
        <>
          <DiamondPicker />
          <div className="leading-text">BUT... IS THERE MORE?</div>
          <div className="tagline-text">
            Letting the perfect stone go can be a risk... but a diamond's
            journey is never over
          </div>
          <div className="action">
            <div
              className="button action-button"
              onClick={() => setShowShippingForm(true)}
            >
              Burn NFT
            </div>
          </div>
          <Countdown date={endTime} />
        </>
      );
    },
    [token?.stage, showShippingForm]
  );

  return (
    <ActionView
      transact={() => shipApi(contract, selectedTokenId)}
      videoUrl={getCDNVideoUrl("post_ship.mp4")}
      isBurn
      requireActionable
    >
      <BurnContent />
    </ActionView>
  );
};

export default Ship;
