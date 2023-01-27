import React from "react";
import Modal from "components/Modal";
import { getCDNImageUrl } from "utils";
import "./InvitedModal.scss";
import { CollectorLink, TwitterLink } from "components/Links";
import WaitFor from "containers/WaitFor";
import Button from "components/Button";

const InvitedModalContent = ({ close, invite }) => {
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

  const { inviter, inviterName, collector, revoked } = invite;

  if (collector || revoked)
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

  return (
    <>
      <div className="leading-text">CONGRATULATIONS</div>
      <div className="text">
        You’ve been invited by{" "}
        <CollectorLink collector={inviter} twitter={inviterName} /> to participate
        in Diamond Dawn’s journey.
      </div>
      <div className="text">
        Your invitation means you're a top candidate for the project, and you'll
        get priority in the review process over other collectors.
      </div>
      <div className="text-center">
        <Button className="gold" onClick={close}>
          Continue
        </Button>
      </div>
    </>
  );
};

const InvitedModal = ({ close, onCopy, invite }) => {
  return (
    <Modal
      className="invited-modal"
      close={close}
      backdropClose={false}
      withCloseBtn
    >
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
