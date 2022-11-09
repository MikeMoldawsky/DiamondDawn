import React from "react";
import Modal from "components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const RequestSubmittedModal = ({ close }) => {
  return (
    <Modal close={close}>
      <div className="center-aligned-column modal-content">
        <FontAwesomeIcon icon={faCheck} />
        <div className="heading">You're On The Waitlist!</div>
        <div>
          Thank you for applying for Diamond Dawn.<br/>
          We carefully examine each application to ensure the best Diamond Dawn experience. Make sure to follow request @DiamondDawnNFT so that we confirm your identity and inform you if you’re accepted.
        </div>
        <div className="text-center">
          <div className="button gold icon-after">
            Follow <FontAwesomeIcon icon={faTwitter} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RequestSubmittedModal;
