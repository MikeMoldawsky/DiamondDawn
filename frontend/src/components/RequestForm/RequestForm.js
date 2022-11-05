import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import "./RequestForm.scss";
import { createInviteRequestApi } from "api/serverApi";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import { isActionPendingSelector } from "store/actionStatusReducer";

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
  const account = useAccount();
  const isSubmitting = useSelector(
    isActionPendingSelector("Request Invitation")
  );

  useEffect(() => {
    reset();
    setIsSubmitSuccess(false);
  }, [isSubmitSuccess]);

  const renderInput = (name, placeholder, opts = {}) => {
    const emptyValue = isEmpty(watch(name));
    const hasError = !isNil(get(errors, name));
    return (
      <input
        {...register(name, {
          required: true,
          onChange: () => setIsRequiredError(false),
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

  const requestInvitation = async ({ twitter, email, note }) => {
    if (!twitter && !email) {
      setIsRequiredError(true);
    }
    await createInviteRequestApi(account.address, { twitter, email, note });
    onSuccess && (await onSuccess());
    setIsSubmitSuccess(true);
  };

  const onSubmitClick = async (data) => {
    const { twitter, email } = data;
    if (!twitter && !email) {
      setIsRequiredError(true);
    } else {
      await requestInvitation(data);
    }
  };

  return (
    <div className="request-form">
      <form>
        <div className="center-aligned-row inputs-row">
          {renderInput("twitter", "Twitter handle", {
            required: false,
            pattern: /^[a-zA-Z0-9_]{4,15}$/i,
          })}
          {renderInput("email", "E-mail", {
            required: false,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })}
        </div>
        <div className="center-start-aligned-row checkbox">
          <input type="checkbox" /> We are a DAO
        </div>
        <textarea
          {...register("note")}
          disabled={isSubmitting}
          className="input"
          placeholder="Tell us why you’d like to join (optional)"
        />
        <ActionButton
          actionKey="Request Invitation"
          onClick={handleSubmit(onSubmitClick)}
          disabled={!isDirty || !isEmpty(errors) || isRequiredError}
        >
          SUBMIT
        </ActionButton>
      </form>
    </div>
  );
};

export default RequestForm;
