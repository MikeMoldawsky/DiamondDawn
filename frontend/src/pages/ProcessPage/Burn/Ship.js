import React, { useCallback, useState } from "react";
import _ from "lodash";
import Countdown from "components/Countdown";
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import {
  loadAccountShippingTokens,
  tokenByIdSelector,
} from "store/tokensReducer";
import { useForm } from "react-hook-form";
import "./Ship.scss";
import classNames from "classnames";
import NoDiamondView from "components/NoDiamondView";
import { DUMMY_VIDEO_URL, DIAMOND_DAWN_TYPE, TRAIT } from "consts";
import { useAccount } from "wagmi";
import useOnConnect from "hooks/useOnConnect";
import ActionButton from "components/ActionButton";
import { getTokenTrait, isTokenOfType } from "utils";
import ActionView from "components/ActionView";
import useActionDispatch from "hooks/useActionDispatch";
import { shipApi } from "api/contractApi";
import DiamondPicker from "components/DiamondPicker";

const Ship = () => {
  const contract = useDDContract();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));
  const [showShippingForm, setShowShippingForm] = useState(false);
  const account = useAccount();
  const actionDispatch = useActionDispatch();
  const tokenType = getTokenTrait(token, TRAIT.type);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useOnConnect(() => {
    actionDispatch(
      loadAccountShippingTokens(contract, account.address),
      "load-shipping-nfts"
    );
  });

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
            <div className="leading-text">ENTER A SHIPPING ADDRESS</div>
            <div className="secondary-text">
              We are committed to your privacy
            </div>
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

      return isTokenOfType(token, DIAMOND_DAWN_TYPE.POLISHED) &&
        !token.isBurned ? (
        <>
          <DiamondPicker />
          <div className="leading-text">BUT... IS THERE MORE?</div>
          <div className="secondary-text">
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
          <Countdown date={endTime} text={["You have", "to burn"]} />
        </>
      ) : (
        <NoDiamondView stageName="burn" />
      );
    },
    [tokenType, showShippingForm]
  );

  return (
    <ActionView
      transact={() => shipApi(contract, selectedTokenId)}
      videoUrl={DUMMY_VIDEO_URL}
      isBurn
    >
      <BurnContent />
    </ActionView>
  );
};

export default Ship;
