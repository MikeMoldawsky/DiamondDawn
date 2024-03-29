import React from "react";
import Modal from "components/Modal";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useForm } from "react-hook-form";
import ActionButton from "components/ActionButton";
import { showError } from "utils";
import { changeMintAddressApi } from "api/serverApi";
import { useSelector } from "react-redux";
import {
  collectorSelector,
  loadCollectorByAddress,
} from "store/collectorReducer";
import { useAccount } from "wagmi";
import classNames from "classnames";
import isNil from "lodash/isNil";
import get from "lodash/get";
import "./ChangeMintAddressModal.scss";
import useActionDispatch from "hooks/useActionDispatch";
import { ethers } from "ethers";
import { ACTION_KEYS } from "consts";

const ChangeMintAddressModal = ({ close }) => {
  const collector = useSelector(collectorSelector);
  const account = useAccount();
  const actionDispatch = useActionDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const changeMintAddress = async ({ newAddress }) => {
    try {
      await changeMintAddressApi(collector._id, account.address, newAddress);
      actionDispatch(
        loadCollectorByAddress(account.address),
        ACTION_KEYS.GET_COLLECTOR_BY_ADDRESS
      );
    } catch (e) {
      showError(e, "Change Address Failed");
      reset();
    }
  };

  const hasError = !isNil(get(errors, "newAddress"));

  return (
    <Modal className="change-address-modal" close={close} withCloseBtn>
      <div className="modal-content">
        <WarningAmberIcon />
        <div className="text">
          You are about to change your minting address.
          <br />
          Once changed, you won't be able to mint with the current address.
        </div>
        <form>
          <div className="input-container">
            <div className="label">New Address</div>
            <input
              {...register("newAddress", {
                required: true,
                validate: {
                  ethAddress: ethers.utils.isAddress,
                },
              })}
              placeholder="Ethereum Address"
              className={classNames("input", {
                "validation-error": hasError,
              })}
            />
          </div>
          <ActionButton
            actionKey="Change Mint Address"
            className="gold"
            onClick={handleSubmit(changeMintAddress)}
            sfx="action"
          >
            CHANGE MINT ADDRESS
          </ActionButton>
        </form>
      </div>
    </Modal>
  );
};

export default ChangeMintAddressModal;
