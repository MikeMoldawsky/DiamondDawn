import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import "./RequestForm.scss";
import { applyToDDApi } from "api/serverApi";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import { isActionPendingSelector } from "store/actionStatusReducer";
import { inviteSelector } from "store/inviteReducer";

const RequestForm = ({ onSuccess }) => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
  });
  const [isRequiredError, setIsRequiredError] = useState(false);
  const [isAddressApprovedError, setIsAddressApprovedError] = useState(false);
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
    setIsRequiredError(false)
    setIsAddressApprovedError(false)
  }

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

  const renderCheckbox = (name, required, opts = {}) => {
    const hasError = required && !watch(name);
    return (
      <input
        type="checkbox"
        {...register(name, {
          onChange: clearErrors,
          ...opts,
        })}
        disabled={isSubmitting}
        className={classNames("input", {
          "validation-error": hasError || isAddressApprovedError,
        })}
      />
    );
  };

  const applyToDD = async (data) => {
    clearErrors()
    const { addressApproved, ...payload } = data
    if (!addressApproved) {
      setIsAddressApprovedError(true)
      return;
    }
    const { twitter, email } = payload
    if (!twitter && !email) {
      setIsRequiredError(true);
      return;
    }
    await applyToDDApi(invite._id, account.address, payload);
    onSuccess && (await onSuccess());
    setIsSubmitSuccess(true);
  };

  return (
    <div className="request-form">
      <form>
        <div className="center-aligned-row inputs-row">
          {renderInput("twitter", "Twitter handle", {
            required: false,
            pattern: /^@[a-zA-Z0-9_]{4,15}$/i,
          })}
          {renderInput("email", "E-mail", {
            required: false,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })}
        </div>
        <div className="center-start-aligned-row checkbox">
          <input type="checkbox" {...register("isDao")} /> We are a DAO
        </div>
        <textarea
          {...register("note")}
          disabled={isSubmitting}
          className="input"
          placeholder="Tell us why you’d like to join (optional)"
        />
        <div className={classNames("center-start-aligned-row checkbox", { "with-error": isAddressApprovedError })}>
          {renderCheckbox("addressApproved", true)}
          Mint address {account.address}
        </div>
        <ActionButton
          actionKey="Request Invitation"
          className="gold"
          onClick={handleSubmit(applyToDD)}
          disabled={!isDirty || !isEmpty(errors) || isRequiredError || isAddressApprovedError}
        >
          SUBMIT
        </ActionButton>
      </form>
    </div>
  );
};

export default RequestForm;
