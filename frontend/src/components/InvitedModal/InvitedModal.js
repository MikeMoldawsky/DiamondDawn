import React from "react";
import Modal from "components/Modal";
import { getCDNImageUrl } from "utils";
import "./InvitedModal.scss";
import { CollectorLink, TwitterLink } from "components/Links";
import CopyButton from "components/CopyButton";
import WaitFor from "containers/WaitFor";
import Button from "components/Button";

const InvitedModalContent = ({ close, onCopy, invite }) => {
  if (!invite)
    return (
      <>
        <div className="leading-text">INVITATION NOT FOUND</div>
        <div className="text">
          We couldn't find your invitation.
          <br />
          Please make sure you copied the invitation link correctly and try to
          refresh the page.
          <br />
          <br />
          If it doesn't work, please contact{" "}
          <TwitterLink className="text-gold">
            <b>@DiamondDawnNFT</b>
          </TwitterLink>
        </div>
        <div className="text-center">
          <Button className="gold" onClick={close} sfx="explore">
            CLOSE
          </Button>
        </div>
      </>
    );

  const { createdBy, inviter, usedBy, revoked } = invite;

  if (usedBy || revoked)
    return (
      <>
        <div className="leading-text">INVITATION USED</div>
        <div className="text">
          This invitation has already been used.
          <br />
          You can contact{" "}
          <TwitterLink className="text-gold">
            <b>@DiamondDawnNFT</b>
          </TwitterLink>{" "}
          for a new invitation
        </div>
        <div className="text-center">
          <Button className="gold" onClick={close} sfx="explore">
            CLOSE
          </Button>
        </div>
      </>
    );

  const copyContent = invite._id.substring(invite._id.length - 8)

  const onCopyClick = () => {
    onCopy && onCopy(copyContent)
    close()
  }

  return (
    <>
      <div className="leading-text">CONGRATULATIONS</div>
      <div className="text">
        You’ve been invited by{" "}
        <CollectorLink collector={createdBy} twitter={inviter} /> to participate
        in Diamond Dawn’s private sale.
      </div>
      <div className="text">
        The following password can ONLY be used for one application - make sure
        to keep it safe.
      </div>
      <div className="text-center">
        <CopyButton
          content={copyContent}
          onCopy={onCopyClick}
        >
          COPY PASSWORD
        </CopyButton>
      </div>
    </>
  );
};

const InvitedModal = ({ close, onCopy, invite }) => {
  return (
    <Modal className="invited-modal" close={close} implicitClose withCloseBtn>
      <div className="center-aligned-column modal-content">
        <WaitFor actions={["get-invite-by-id"]}>
          <div className="image">
            <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
          </div>
          <InvitedModalContent close={close} onCopy={onCopy} invite={invite} />
        </WaitFor>
      </div>
    </Modal>
  );
};

export default InvitedModal;
