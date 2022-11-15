import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import "./NewInvitationForm.scss";
import { createInvitationApi, getDDCollectorApi } from "api/serverApi";

const NewInvitationForm = ({ onSuccess }) => {
  const [ddCollector, setDDCollector] = useState([]);
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

  const fetchDDCollector = async () => {
    setDDCollector(await getDDCollectorApi());
  };

  useEffect(() => {
    fetchDDCollector();
  }, []);

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

  const createInvitation = async ({ note }) => {
    await createInvitationApi(ddCollector._id, note);
    setIsSubmitSuccess(true);
    onSuccess && (await onSuccess());
  };

  return (
    <div className="request-form">
      <div className="secondary-text">CREATE INVITATION</div>
      <form>
        {renderInput("note", "Note", {
          required: false,
        })}
        <ActionButton
          actionKey="Create Invitation"
          onClick={handleSubmit(createInvitation)}
          disabled={!isEmpty(errors)}
        >
          CREATE
        </ActionButton>
      </form>
    </div>
  );
};

export default NewInvitationForm;
