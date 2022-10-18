import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import "./RequestForm.scss";
import { utils as ethersUtils } from "ethers";

const RequestForm = ({
  optionalIdentity,
  createInviteApi,
  onSuccess,
}) => {
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
          "validation-error": hasError,
          "validation-success": !emptyValue && !hasError,
        })}
      />
    );
  };

  const requestInvitation = async ({ identifier, address }) => {
    await createInviteApi(address, identifier);
    onSuccess && (await onSuccess());
    setIsSubmitSuccess(true);
  };

  return (
    <div className="request-form">
      <form>
        <div className="center-aligned-row inputs-row">
          {renderInput("identifier", "Twitter link", {
            required: !optionalIdentity,
            pattern:
              /^[a-zA-Z0-9_]{4,15}$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })}
          {renderInput("address", "E-mail", {
            validate: {
              ethaddress: ethersUtils.isAddress,
            },
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
