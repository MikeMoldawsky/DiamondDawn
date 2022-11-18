import React from "react";
import Modal from "components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { TwitterLink } from "components/Links";

const RequestSubmittedModal = ({ close }) => {
  return (
    <Modal className="request-submitted" close={close} withCloseBtn>
      <div className="center-aligned-column modal-content">
        <FontAwesomeIcon icon={faCheck} />
        <div className="heading">You're On The Waitlist!</div>
        <div>
          We’ll send you an email and a Twitter DM if you're accepted. <br />
          Make sure to follow request @DiamondDawnNFT.
        </div>
        <div className="text-center">
          <TwitterLink className="button gold icon-after">
            Follow <FontAwesomeIcon icon={faTwitter} />
          </TwitterLink>
        </div>
      </div>
    </Modal>
  );
};

export default RequestSubmittedModal;
