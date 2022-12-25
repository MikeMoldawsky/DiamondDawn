import React, { useEffect, useState } from "react";
import isNil from "lodash/isNil";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import "./ApplyForm.scss";
import { applyToDDApi } from "api/serverApi";
import { useAccount, useSignMessage } from "wagmi";
import { useSelector } from "react-redux";
import { inviteSelector } from "store/inviteReducer";
import Checkbox from "components/Checkbox";
import { showError } from "utils";
import Wallet from "components/Wallet";
import { uiSelector } from "store/uiReducer";
import {
  StageCountdown,
  StageCountdownWithText,
} from "components/Countdown/Countdown";

const getValidationError = (name, value) => {
  switch (name) {
    case "email":
      return !value ? "Required" : "Invalid email address";
    case "twitter":
      if (!value) return "";
      if (!value.startsWith("@")) {
        return "Must start with '@'";
      }
      return "Invalid twitter handle";
    case "note":
      return "Required";
    default:
      return `Invalid ${name}`;
  }
};

const ApplyForm = ({ onSuccess, onError }) => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    getValues,
    watch,
    trigger,
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
  });
  const account = useAccount();
  const invite = useSelector(inviteSelector);
  const { geoLocation } = useSelector(uiSelector);

  const applyToDD = async () => {
    try {
      const data = getValues();
      const inviteId =
        invite && !invite.used && !invite.revoked ? invite._id : null;
      await applyToDDApi(inviteId, account.address, data, geoLocation);
      setIsSubmitSuccess(true);
      onSuccess && (await onSuccess(account.address));
    } catch (e) {
      showError(e, "Apply Failed");
      onError && onError();
    }
  };

  const { signMessage } = useSignMessage({
    message:
      "Welcome to Diamond Dawn!\n" +
      "\n" +
      "Sign to accept the Terms of Agreement: https://diamonddawn.art/tnc\n" +
      "\n" +
      "This request will not trigger a blockchain transaction or cost any gas fees.",
    onError(error) {
      showError(error, "Sign Failed");
      setDisabled(false);
    },
    onSuccess(data) {
      applyToDD();
    },
  });

  const signAndApply = () => {
    if (!account?.address) {
      return trigger();
    }
    setDisabled(true);
    signMessage();
  };

  useEffect(() => {
    reset();
    setIsSubmitSuccess(false);
  }, [isSubmitSuccess]);

  const renderErrorMessage = (name) => {
    return !isNil(get(errors, name)) ? (
      <div className="form-error">
        * {getValidationError(name, watch(name))}
      </div>
    ) : null;
  };

  const renderInput = (name, placeholder, opts = {}) => {
    return (
      <>
        <input
          {...register(name, {
            required: true,
            ...opts,
          })}
          disabled={disabled}
          placeholder={placeholder}
          className={classNames("input", {
            "with-error": !isNil(get(errors, name)),
          })}
        />
        {renderErrorMessage(name)}
      </>
    );
  };

  return (
    <div className="request-form">
      <form>
        <div className="center-aligned-row inputs-row">
          <div className="input-container">
            <div className="label">Email</div>
            {renderInput("email", "diamond@gmail.com", {
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            })}
          </div>
          <div className="input-container">
            <div className="label">Twitter Handle</div>
            {renderInput("twitter", "@diamond", {
              required: false,
              pattern: /^@[a-zA-Z0-9_]{4,15}$/i,
            })}
          </div>
        </div>
        <div className="left-center-aligned-row checkbox">
          <Checkbox
            register={register}
            watch={watch}
            setValue={setValue}
            name="isDao"
          >
            We are a DAO
          </Checkbox>
        </div>
        <div className="input-container textarea-container">
          <div className="label">Reason</div>
          <textarea
            {...register("note", { required: true })}
            disabled={disabled}
            className={classNames("input", {
              "with-error": !isNil(get(errors, "note")),
            })}
            placeholder="Why are you a good fit for Diamond Dawn? (optional)"
          />
          {renderErrorMessage("note")}
        </div>
        <div className="center-aligned-row address-row">
          <div className="input-container">
            <div className="label">Minting Address</div>
            <input
              type="text"
              className={classNames("input full-width", {
                "with-error": !account?.address && isSubmitted,
              })}
              disabled
              value={account?.address || ""}
              title="If approved, this address will be the one eligible for mint"
            />
          </div>
          {!account?.address && <Wallet />}
        </div>
        <div className="text-comment">
          * Don't worry, you can change your minting address at any point
        </div>
        <div className="left-center-aligned-row buttons">
          <ActionButton
            actionKey="Request Invitation"
            className="gold"
            isLoading={disabled}
            onClick={handleSubmit(signAndApply)}
            sfx="action"
          >
            SIGN & SUBMIT
          </ActionButton>
          <StageCountdownWithText />
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;
