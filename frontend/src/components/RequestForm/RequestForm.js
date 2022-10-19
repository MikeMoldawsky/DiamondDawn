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
import Modal from "components/Modal";
import {useAccountModal, useConnectModal} from "@rainbow-me/rainbowkit";
import {shortenEthAddress} from "utils";
import {useSelector} from "react-redux";
import {isActionPendingSelector} from "store/actionStatusReducer";

const RequestForm = ({ onSuccess }) => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
  });
  const [isRequiredError, setIsRequiredError] = useState(false)
  const account = useAccount()
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const { openAccountModal } = useAccountModal();
  const isSubmitting = useSelector(isActionPendingSelector("Request Invitation"))

  useEffect(() => {
    reset();
    setIsSubmitSuccess(false);
  }, [isSubmitSuccess]);

  const renderInput = (name, placeholder, opts = {}) => {
    const emptyValue = isEmpty(watch(name));
    const hasError = !isNil(get(errors, name));
    return (
      <input
        {...register(name, { required: true, onChange: () => setIsRequiredError(false), ...opts })}
        disabled={isSubmitting}
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
    setIsApproveModalOpen(false)
    await createInviteRequestApi(account.address, {twitter, email, note});
    onSuccess && (await onSuccess());
    setIsSubmitSuccess(true);
  };

  const onSubmitClick = async () => {
    const { twitter, email } = getValues()
    if (!twitter && !email) {
      setIsRequiredError(true)
    }
    else {
      setIsApproveModalOpen(true)
    }
  }

  const onChangeWalletClick = e => {
    e.preventDefault()
    openAccountModal()
  }

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
        <textarea {...register("note")} disabled={isSubmitting} className="input" placeholder="Tell us why" />
        <ActionButton
          actionKey="Request Invitation"
          onClick={onSubmitClick}
          disabled={!isEmpty(errors)}
        >
          SUBMIT
        </ActionButton>
        {isApproveModalOpen && (
          <Modal close={() => setIsApproveModalOpen(false)}>
            <div className="modal-heading">{shortenEthAddress(account.address)}</div>
            <div className="modal-content">Are you sure this is the wallet address you would like to submit the request with?</div>
            <div className="modal-buttons">
              <ActionButton
                actionKey="Request Invitation"
                onClick={handleSubmit(requestInvitation)}
              >
                YES
              </ActionButton>
              <button className="inverted" onClick={onChangeWalletClick}>Change Wallet</button>
            </div>
          </Modal>
        )}
      </form>
    </div>
  );
};

export default RequestForm;
