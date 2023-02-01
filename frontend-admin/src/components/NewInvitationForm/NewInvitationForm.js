import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import "./NewInvitationForm.scss";
import { createInvitationApi } from "api/serverApi";
import Checkbox from "components/Checkbox";

const NewInvitationForm = ({ ddCollector, onSuccess }) => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      count: 1,
    },
  });

  useEffect(() => {
    reset();
    setIsSubmitSuccess(false);
  }, [isSubmitSuccess]);

  const renderInput = (name, placeholder, opts = {}) => {
    const emptyValue = isEmpty(watch(name));
    const hasError = !isNil(get(errors, name));
    return (
      <div className="input-container">
        <input
          {...register(name, { required: true, ...opts })}
          placeholder={placeholder}
          className={classNames({
            "validation-error": hasError,
            "validation-success": !emptyValue && !hasError,
          })}
        />
      </div>
    );
  };

  const createInvitation = async ({ count, ...invitation }) => {
    await createInvitationApi(
      { ...invitation, inviter: ddCollector._id },
      count
    );
    setIsSubmitSuccess(true);
    onSuccess && (await onSuccess());
  };

  return (
    <div className="create-invites-form">
      <div className="secondary-text">CREATE INVITATIONS</div>
      <form>
        {renderInput("note", "Note", {
          required: false,
        })}
        {renderInput("inviterName", "Override inviter twitter handle", {
          required: false,
          pattern: /^@[a-zA-Z0-9_]{4,15}$/i,
        })}
        <div className="center-aligned-row input-container cbx-row">
          <Checkbox
            register={register}
            watch={watch}
            setValue={setValue}
            name="honoraryInvitee"
          >
            Honorary
          </Checkbox>
          <Checkbox
            register={register}
            watch={watch}
            setValue={setValue}
            name="trustedInvitee"
          >
            Trusted
          </Checkbox>
          <input
            type="number"
            placeholder="# NFTs"
            {...register("numNFTs", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="center-aligned-row input-container button-row">
          <div className="center-aligned-row invite-num">
            X
            <input
              type="number"
              placeholder="Invitation Count"
              {...register("count", {
                valueAsNumber: true,
              })}
            />
          </div>
          <ActionButton
            actionKey="Create Invitation"
            onClick={handleSubmit(createInvitation)}
            disabled={!isEmpty(errors)}
          >
            CREATE
          </ActionButton>
        </div>
      </form>
    </div>
  );
};

export default NewInvitationForm;
