import React from "react";
import Modal from "components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {getCDNImageUrl} from "utils";
import {faCopy} from "@fortawesome/free-solid-svg-icons/faCopy";
import "./InvitedModal.scss"
import { CopyToClipboard } from "react-copy-to-clipboard";

const InvitedModal = ({ close, invite }) => {
  const { createdBy: inviter } = invite

  return (
    <Modal className="invited-modal" close={close}>
      <div className="center-aligned-column modal-content">
        <div className="image">
          <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
        </div>
        <div className="leading-text">CONGRATULATIONS</div>
        <div className="text">
          You’ve been invited by {inviter.twitter} to participate in Diamond Dawn’s private sale.
        </div>
        <div className="text">
          The following password can ONLY be used for one application -  make sure to keep it safe.
        </div>
        <div className="pwd-row">
          Your password to enter Diamond Dawn XXXXXXXX
        </div>
        <div className="text-center">
          <CopyToClipboard text={invite._id.substring(invite._id.length - 8)} onCopy={close}>
            <div className="button gold icon-after">
              COPY PASSWORD <FontAwesomeIcon icon={faCopy} />
            </div>
          </CopyToClipboard>
        </div>
      </div>
    </Modal>
  );
};

export default InvitedModal;
