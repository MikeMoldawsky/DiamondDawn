import React from "react";
import Modal from "components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const RequestSubmittedModal = ({ close }) => {
  return (
    <Modal className="request-submitted" close={close} withCloseBtn>
      <div className="center-aligned-column modal-content">
        <FontAwesomeIcon icon={faCheck} />
        <div className="heading">You're On The Waitlist!</div>
        <div>
          If you’re accepted, we’ll send you an email and a Twitter DM. <br />
          <br />
          Make sure to follow request @DiamondDawnNFT.
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
