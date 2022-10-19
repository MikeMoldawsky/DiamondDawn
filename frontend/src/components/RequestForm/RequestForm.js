import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import "./RequestForm.scss";
import {createInviteRequestApi} from "api/serverApi";
import {useAccount} from "wagmi";

const RequestForm = ({ onSuccess }) => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
  });
  const [isRequiredError, setIsRequiredError] = useState(false)
  const account = useAccount()

  useEffect(() => {
    reset();
    setIsSubmitSuccess(false);
  }, [isSubmitSuccess]);

  const renderInput = (name, placeholder, opts = {}) => {
    const emptyValue = isEmpty(watch(name));
    const hasError = !isNil(get(errors, name));
    return (
      <input
        {...register(name, { required: true, ...opts })}
        placeholder={placeholder}
        className={classNames("input", {
          "validation-error": hasError || isRequiredError,
          "validation-success": !emptyValue && !hasError,
        })}
      />
    );
  };

  const requestInvitation = async ({twitter, email, note}) => {
    if (!twitter && !email) {
      setIsRequiredError(true)
    }
    await createInviteRequestApi(account.address, {twitter, email, note});
    onSuccess && (await onSuccess());
    setIsSubmitSuccess(true);
  };

  return (
    <div className="request-form">
      <form>
        <div className="center-aligned-row inputs-row">
          {renderInput("twitter", "Twitter link", {
            required: false,
            pattern: /^[a-zA-Z0-9_]{4,15}$/i,
          })}
          {renderInput("email", "E-mail", {
            required: false,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })}
        </div>
        <div className="text-comment">Fill in one or more</div>
        <textarea {...register("note")} className="input" placeholder="Tell us why" />
        <ActionButton
          actionKey="Request Invitation"
          onClick={handleSubmit(requestInvitation)}
          disabled={!isEmpty(errors)}
        >
          SUBMIT
        </ActionButton>
      </form>
    </div>
  );
};

export default RequestForm;
