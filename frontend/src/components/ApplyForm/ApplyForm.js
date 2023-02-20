import React, { useEffect, useState } from "react";
import isNil from "lodash/isNil";
import get from "lodash/get";
import omit from "lodash/omit";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import ActionButton from "components/ActionButton";
import "./ApplyForm.scss";
import { applyToDDApi } from "api/serverApi";
import { useAccount, useSignMessage } from "wagmi";
import { useSelector } from "react-redux";
import { inviteSelector } from "store/inviteReducer";
import Checkbox from "components/Checkbox";
import {getCDNImageUrl, showError} from "utils";
import Wallet from "components/Wallet";
import { uiSelector } from "store/uiReducer";
import IncreaseChances from "components/IncreaseChances";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faArrowUpFromBracket} from "@fortawesome/free-solid-svg-icons";

const getValidationError = (name, value) => {
  switch (name) {
    case "email":
      return !value ? "Required" : "Invalid email address";
    case "twitter":
      if (!value) return "";
      if (!value.startsWith("@")) {
        return "Must start with '@'";
      }
      return "Invalid twitter handle";
    case "note":
      return "Required";
    default:
      return `Invalid ${name}`;
  }
};

const ApplyForm = ({ isPreApproved, onSuccess, onError }) => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    getValues,
    watch,
    trigger,
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
  });
  const account = useAccount();
  const invite = useSelector(inviteSelector);
  const { geoLocation } = useSelector(uiSelector);
  const [image, setImage] = useState(null)

  const onImageChange = e => {
    setImage(URL.createObjectURL(e.target.files[0]))
  }

  const uploadPhoto = async (file, overrideFileName) => {
    const filename = encodeURIComponent(overrideFileName)
    const fileType = encodeURIComponent(file.type)

    const res = await fetch(
      `/api/upload_profile_image?file=${filename}&fileType=${fileType}`
    )
    const { url, fields } = await res.json()
    const formData = new FormData()

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value)
    })

    await fetch(url, {
      method: 'POST',
      body: formData,
    })
  }

  const applyToDD = async () => {
    try {
      const data = getValues();
      const withImage = data.image.length > 0
      if (withImage) {
        const { type } = data.image[0]
        data.imageExt = type.substring(type.indexOf("/") + 1)
      }
      const inviteId =
        invite && !invite.used && !invite.revoked ? invite._id : null;
      const collector = await applyToDDApi(
        inviteId,
        account.address,
        omit(data, "image"),
        geoLocation
      );
      if (withImage) {
        try {
          await uploadPhoto(data.image[0], collector.image)
        }
        catch (e) {
          console.error("Failed to upload image to s3")
          // do not fail the process
        }
      }
      setIsSubmitSuccess(true);
      onSuccess && (await onSuccess(collector));
    } catch (e) {
      showError(e, "RequestToJoin Failed");
      onError && onError();
    }
  };

  const { signMessage } = useSignMessage({
    message:
      "Welcome to Diamond Dawn!\n" +
      "\n" +
      "Sign to accept the Terms of Agreement: https://diamonddawn.art/tnc\n" +
      "\n" +
      "This request will not trigger a blockchain transaction or cost any gas fees.",
    onError(error) {
      showError(error, "Sign Failed");
      setDisabled(false);
    },
    onSuccess(data) {
      applyToDD();
    },
  });

  const signAndApply = () => {
    if (!account?.address) {
      return trigger();
    }
    setDisabled(true);
    signMessage();
  };

  useEffect(() => {
    reset();
    setIsSubmitSuccess(false);
  }, [isSubmitSuccess]);

  const renderErrorMessage = (name) => {
    return !isNil(get(errors, name)) ? (
      <div className="form-error">
        * {getValidationError(name, watch(name))}
      </div>
    ) : null;
  };

  const renderInput = (name, placeholder, opts = {}) => {
    return (
      <>
        <input
          {...register(name, {
            required: true,
            ...opts,
          })}
          disabled={disabled}
          placeholder={placeholder}
          className={classNames("input", {
            "with-error": !isNil(get(errors, name)),
          })}
        />
        {renderErrorMessage(name)}
      </>
    );
  };

  return (
    <div className="request-form">
      <form>
        <div className="center-aligned-row inputs-row">
          <div className="left-centered-aligned-column info-inputs">
            <div className="input-container">
              <div className="label">Email</div>
              {renderInput("email", "diamond@gmail.com", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
            </div>
            <div className="input-container">
              <div className="label">Twitter Handle</div>
              {renderInput("twitter", "@diamond", {
                required: false,
                pattern: /^@[a-zA-Z0-9_]{4,15}$/i,
              })}
            </div>
          </div>
          <div className="image-input">
            <div className="image-container">
              <img src={image || getCDNImageUrl("avatar.png")} alt="" />
            </div>
            <FontAwesomeIcon icon={image ? faPenToSquare : faArrowUpFromBracket} />
            <input
              className="hidden-input"
              type="file"
              accept="image/png, image/jpeg"
              {...register("image", {
                onChange: onImageChange,
              })}
            />
          </div>
        </div>
        <div className="input-container textarea-container">
          <div className="label">Reason</div>
          <textarea
            {...register("note", { required: !isPreApproved })}
            disabled={disabled}
            className={classNames("input", {
              "with-error": !isNil(get(errors, "note")),
            })}
            placeholder="Why are you a good fit for Diamond Dawn?"
          />
          {renderErrorMessage("note")}
        </div>
        <div className="center-aligned-row address-row">
          <div className="input-container">
            <div className="label">Minting Address</div>
            <input
              type="text"
              className={classNames("input full-width", {
                "with-error": !account?.address && isSubmitted,
              })}
              disabled
              value={account?.address || ""}
              title="If approved, this address will be the one eligible for mint"
            />
          </div>
          {!account?.address && <Wallet />}
        </div>
        <div className="text-comment">
          * Don't worry, you can change your minting address at any point
        </div>
        <div className="left-center-aligned-row buttons">
          <ActionButton
            actionKey="Request Invitation"
            className="gold"
            isLoading={disabled}
            onClick={handleSubmit(signAndApply)}
            sfx="action"
          >
            SUBMIT
          </ActionButton>
        </div>
        {!isPreApproved && <IncreaseChances />}
      </form>
    </div>
  );
};

export default ApplyForm;
