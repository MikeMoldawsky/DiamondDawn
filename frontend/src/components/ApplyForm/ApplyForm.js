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
import { isActionPendingSelector } from "store/actionStatusReducer";
import { inviteSelector } from "store/inviteReducer";
import Checkbox from "components/Checkbox";
import { showError } from "utils";
import useSound from "use-sound";
import sparklesSFX from "assets/audio/end-sparkles.mp3";

const ApplyForm = ({ disabled, onSubmit, onSuccess, onError }) => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
  });
  const [isRequiredError, setIsRequiredError] = useState(false);
  const account = useAccount();
  const isSubmitting = useSelector(
    isActionPendingSelector("Request Invitation")
  );
  const invite = useSelector(inviteSelector);
  const [playSparklesSFX] = useSound(sparklesSFX);

  useEffect(() => {
    reset();
    setIsSubmitSuccess(false);
  }, [isSubmitSuccess]);

  const clearErrors = () => {
    setIsRequiredError(false);
  };

  const renderInput = (name, placeholder, opts = {}) => {
    const emptyValue = isEmpty(watch(name));
    const hasError = !isNil(get(errors, name));
    return (
      <input
        {...register(name, {
          required: true,
          onChange: clearErrors,
          ...opts,
        })}
        disabled={disabled}
        placeholder={placeholder}
        className={classNames("input", {
          "validation-error": hasError || isRequiredError,
          "validation-success": !emptyValue && !hasError,
        })}
      />
    );
  };

  const applyToDD = async (data) => {
    clearErrors();
    const { twitter, email } = data;
    if (!twitter && !email) {
      setIsRequiredError(true);
      return;
    }
    try {
      onSubmit && onSubmit()
      await applyToDDApi(invite._id, account.address, data);
      onSuccess && (await onSuccess());
      setIsSubmitSuccess(true);
    } catch (e) {
      showError(e, "Apply Failed");
      onError && onError()
    }
  };

  return (
    <div className="request-form">
      <form>
        <div className="center-aligned-row address-row">
          <div className="input-container">
            <div className="label">Minting Address</div>
            <input
              type="text"
              className="input full-width"
              disabled
              value={account.address}
              title="If approved, this address will be the one eligible for mint"
            />
          </div>
        </div>
        <div className="center-aligned-row inputs-row">
          <div className="input-container">
            <div className="label">Twitter Handle</div>
            {renderInput("twitter", "@diamond", {
              required: false,
              pattern: /^@[a-zA-Z0-9_]{4,15}$/i,
            })}
          </div>
          <div className="input-container">
            <div className="label">Email</div>
            {renderInput("email", "diamond@gmail.com", {
              required: false,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
            {...register("note")}
            disabled={disabled}
            className="input"
            placeholder="Why are you a good fit for Diamond Dawn? (optional)"
          />
        </div>
        <ActionButton
          actionKey="Request Invitation"
          className="gold"
          onClick={handleSubmit(applyToDD)}
          disabled={disabled || !isDirty || !isEmpty(errors) || isRequiredError}
          sfx="action"
        >
          SUBMIT
        </ActionButton>
      </form>
    </div>
  );
};

export default ApplyForm;
