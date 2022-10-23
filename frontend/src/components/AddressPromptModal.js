import React from "react";
import ActionButton from "components/ActionButton";
import "./RequestForm.scss";
import { useAccount } from "wagmi";
import Modal from "components/Modal";
import { useAccountModal } from "@rainbow-me/rainbowkit";
import { shortenEthAddress } from "utils";

const AddressPromptModal = ({ onSubmit }) => {
  const account = useAccount();
  const { openAccountModal } = useAccountModal();

  const onChangeWalletClick = (e) => {
    e.preventDefault();
    openAccountModal();
  };

  return (
    <Modal close={close}>
      <div className="modal-heading">
        {shortenEthAddress(account.address)}
      </div>
      <div className="modal-content">
        Are you sure this is the wallet address you would like to submit
        the request with?
      </div>
      <div className="modal-buttons">
        <ActionButton
          actionKey="Request Invitation"
          onClick={onSubmit}
        >
          YES
        </ActionButton>
        <button className="button inverted" onClick={onChangeWalletClick}>
          Change Wallet
        </button>
      </div>
    </Modal>
  );
};

export default AddressPromptModal;
