import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./InvitePage.scss";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { openInvite } from "api/serverApi";
import EnterMine from "pages/ProcessPage/EnterMine";
import ActionButton from "components/ActionButton";
import {useSelector} from "react-redux";
import {systemSelector} from "store/systemReducer";
import {SYSTEM_STAGE} from "consts";

const isInviteRevoked = async (inviteId) => {
  try {
    const res = await axios.post(`/api/is_invite_revoked`, { inviteId });
    return res.data;
  } catch (e) {
    return true;
  }
};

const InvitationRevoked = () => (
  <>
    <h1>Invitation Revoked</h1>
    <div className="text-center">
      For another invitation please DM Diamonds Dawn on twitter
    </div>
    <a
      target="_blank"
      rel="noreferrer"
      href="https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20"
    >
      <div className="button">Request Invitation</div>
    </a>
  </>
);

const InviteIntro = ({ open }) => (
  <>
    <h1>You Are Invited to Diamonds Dawn!</h1>
    <div className="warning-message">
      <FontAwesomeIcon icon={faExclamationTriangle} />
      <div className="warning-text">
        The invitation can be opened one time only and will be revoked once
        opened.
        <br />
        Please make sure you have the time before opening the invitation
      </div>
    </div>
    <ActionButton actionKey={`Open Invite`} onClick={open}>
      OPEN INVITATION
    </ActionButton>
  </>
);

const InvitePage = () => {
  const { inviteId } = useParams();
  const [invite, setInvite] = useState(null);
  const [password, setPassword] = useState(null);
  const [isRevoked, setIsRevoked] = useState(null);
  const { systemStage, isStageActive } = useSelector(systemSelector)

  const fetchIsRevoked = async () => {
    setIsRevoked(await isInviteRevoked(inviteId));
  };

  useEffect(() => {
    if (inviteId) {
      fetchIsRevoked();
    }
  }, [inviteId]);

  const onOpenInviteClick = async () => {
    const { invite: _invite, password: _password } = await openInvite(inviteId);
    setInvite(_invite);
    setPassword(_password + "");
  };

  const renderInviteContent = () => {
    if (systemStage !== SYSTEM_STAGE.INVITATIONS || !isStageActive) return (
      <h1>Invitations stage is closed</h1>
    )
    if (isRevoked === null) return null;
    if (isRevoked) return <InvitationRevoked />;
    if (!invite) return <InviteIntro open={onOpenInviteClick} />;
    if (password) return <EnterMine password={password} />;
    return null;
  };

  return (
    <div className={classNames("page process-page invite-page")}>
      <div className="inner-page">{renderInviteContent()}</div>
    </div>
  );
};

export default InvitePage;
