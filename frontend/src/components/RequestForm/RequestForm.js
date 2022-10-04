import React from "react";
import _ from "lodash";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import './RequestForm.scss'
import { utils as ethersUtils } from 'ethers'
import {createInviteRequestApi} from "api/serverApi";

const RequestForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onChange',
  });

  const renderInput = (name, placeholder, opts = {}) => {
    const emptyValue = _.isEmpty(watch(name))
    const hasError = !_.isNil(_.get(errors, name))
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

  const requestInvitation = async ({ identifier, address }) => {
    console.log('requestInvitation', {identifier, address})
    const res = await createInviteRequestApi(identifier, address)
    console.log('requestInvitation SUCCESS', res)
  }

  return (
    <div className="request-form">
      <div className="secondary-text">
        REQUEST INVITATION
      </div>
      <form>
        {renderInput("identifier", "Twitter/Email", {
          pattern: /^[a-zA-Z0-9_]{4,15}$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        })}
        {renderInput("address", "ETH Address", {
          validate: {
            ethaddress: ethersUtils.isAddress,
          }
        })}
        <ActionButton actionKey="Request Invitation" onClick={handleSubmit(requestInvitation)} disabled={!_.isEmpty(errors)}>
          Request Invitation
        </ActionButton>
      </form>
    </div>
  );
};

export default RequestForm;
