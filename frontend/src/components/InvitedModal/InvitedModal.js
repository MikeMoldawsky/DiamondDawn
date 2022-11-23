import React from "react";
import Modal from "components/Modal";
import { getCDNImageUrl } from "utils";
import "./InvitedModal.scss";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "components/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CollectorLink } from "components/Links";

const InvitedModal = ({ close, invite }) => {
  const { createdBy, inviter } = invite;

  return (
    <Modal className="invited-modal" close={close} implicitClose withCloseBtn>
      <div className="center-aligned-column modal-content">
        <div className="image">
          <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
        </div>
        <div className="leading-text">CONGRATULATIONS</div>
        <div className="text">
          You’ve been invited by <CollectorLink collector={createdBy} twitter={inviter} /> to
          participate in Diamond Dawn’s private sale.
        </div>
        <div className="text">
          The following password can ONLY be used for one application - make
          sure to keep it safe.
        </div>
        <div className="text-center">
          <CopyToClipboard
            text={invite._id.substring(invite._id.length - 8)}
            onCopy={close}
          >
            <Button className="icon-after gold" sfx="utility">
              COPY PASSWORD <ContentCopyIcon />
            </Button>
          </CopyToClipboard>
        </div>
      </div>
    </Modal>
  );
};

export default InvitedModal;
