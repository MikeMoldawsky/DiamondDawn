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

const ApplyForm = ({ onSuccess }) => {
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
        disabled={isSubmitting}
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
    await applyToDDApi(invite._id, account.address, data);
    onSuccess && (await onSuccess());
    setIsSubmitSuccess(true);
  };

  return (
    <div className="request-form">
      <form>
        <div className="center-aligned-row address-row">
          <div className="input-container">
            <div className="label">Ethereum Address</div>
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
            {renderInput("twitter", "@example", {
              required: false,
              pattern: /^@[a-zA-Z0-9_]{4,15}$/i,
            })}
          </div>
          <div className="input-container">
            <div className="label">E-Mail</div>
            {renderInput("email", "email@example.com", {
              required: false,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            })}
          </div>
        </div>
        <div className="center-start-aligned-row checkbox">
          <Checkbox register={register} watch={watch} setValue={setValue} name="isDao">We are a DAO</Checkbox>
        </div>
        <div className="input-container textarea-container">
          <div className="label">Reason</div>
          <textarea
            {...register("note")}
            disabled={isSubmitting}
            className="input"
            placeholder="Why are you a good fit for Diamond Dawn? (optional)"
          />
        </div>
        <ActionButton
          actionKey="Request Invitation"
          className="gold"
          onClick={handleSubmit(applyToDD)}
          disabled={!isDirty || !isEmpty(errors) || isRequiredError}
        >
          SUBMIT
        </ActionButton>
      </form>
    </div>
  );
};

export default ApplyForm;
