import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import "./ApplyForm.scss";
import { applyToDDApi } from "api/serverApi";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import { inviteSelector } from "store/inviteReducer";
import Checkbox from "components/Checkbox";
import { showError } from "utils";
import Wallet from "components/Wallet";
import { uiSelector } from "store/uiReducer";
import { StageCountdown } from "components/Countdown/Countdown";

const getValidationError = (name, value) => {
  switch (name) {
    case "email":
      return !value ? "Required" : "Invalid email address";
    case "twitter":
      if (!value) return "Required";
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

const ApplyForm = ({ disabled, onSubmit, onSuccess, onError }) => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
  });
  const account = useAccount();
  const invite = useSelector(inviteSelector);
  const { geoLocation } = useSelector(uiSelector);

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
          className={classNames("input")}
        />
        {renderErrorMessage(name)}
      </>
    );
  };

  const applyToDD = async (data) => {
    try {
      onSubmit && onSubmit();
      const inviteId = invite && !invite.used && !invite.revoked ? invite._id : null
      await applyToDDApi(inviteId, account.address, data, geoLocation);
      setIsSubmitSuccess(true);
      onSuccess && (await onSuccess(account.address));
    } catch (e) {
      showError(e, "Apply Failed");
      onError && onError();
    }
  };

  const twitter = watch("twitter");
  const email = watch("email");

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
              required: true,
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
            className="input"
            placeholder="Why are you a good fit for Diamond Dawn? (optional)"
          />
          {renderErrorMessage("note")}
        </div>
        <div className="center-aligned-row address-row">
          <div className="input-container">
            <div className="label">Minting Address</div>
            <input
              type="text"
              className="input full-width"
              disabled
              value={account?.address || ""}
              title="If approved, this address will be the one eligible for mint"
            />
          </div>
          {!account?.address && (
            <Wallet className={classNames({ error: isSubmitted })} />
          )}
        </div>
        <div className="text-comment">
          * Don't worry, you can change your minting address at any point
        </div>
        <div className="left-center-aligned-row buttons">
          <ActionButton
            actionKey="Request Invitation"
            className="gold"
            onClick={handleSubmit(applyToDD)}
            sfx="action"
          >
            SUBMIT
          </ActionButton>
          <StageCountdown />
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;
