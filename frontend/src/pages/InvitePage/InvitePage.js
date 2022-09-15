import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./InvitePage.scss";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { getInviteApi, openInviteApi } from "api/serverApi";
import EnterMine from "pages/ProcessPage/EnterMine";
import ActionButton from "components/ActionButton";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import { SYSTEM_STAGE } from "consts";
import useActionDispatch from "hooks/useActionDispatch";
import { isActionSuccessSelector } from "store/actionStatusReducer";

const InvalidInvitation = ({ title }) => (
  <>
    <h1>{title}</h1>
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

const secondsToString = (seconds) => {
  const numDays = Math.floor((seconds % 31536000) / 86400);
  const numHours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const numMinutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  return `${numDays > 0 ? numDays + " Days " : ""}${
    numHours > 0 ? numHours + " Hours and " : ""
  }${numMinutes} Minutes`;
};

const InviteIntro = ({ open }) => {
  // 3 Days, 3 Hours and 3 Minutes = 270180
  const ttl = secondsToString(process.env.REACT_APP_INVITE_TTL_SECONDS);
  return (
    <>
      <h1>You Are Invited to Diamonds Dawn!</h1>
      <div className="warning-message">
        <FontAwesomeIcon icon={faExclamationTriangle} />
        <div className="warning-text">
          Once opened, the invitation will be valid for {ttl} before it expires.
        </div>
      </div>
      <ActionButton actionKey={`Open Invite`} onClick={open}>
        OPEN INVITATION
      </ActionButton>
    </>
  );
};

const InvitePage = () => {
  const { inviteId } = useParams();
  const [invite, setInvite] = useState(null);
  const [password, setPassword] = useState(null);
  const { systemStage, isStageActive } = useSelector(systemSelector);
  const isGetInviteSuccess = useSelector(isActionSuccessSelector("get-invite"));
  const actionDispatch = useActionDispatch();

  useEffect(() => {
    if (inviteId) {
      actionDispatch(async () => {
        setInvite(await getInviteApi(inviteId));
      }, "get-invite");
    }
  }, [inviteId]);

  const onOpenInviteClick = async () => {
    const { invite: _invite, password: _password } = await openInviteApi(
      inviteId
    );
    setInvite(_invite);
    setPassword(_password + "");
  };

  const renderInviteContent = () => {
    if (systemStage !== SYSTEM_STAGE.INVITE || !isStageActive)
      return <h1>Invitations stage is closed</h1>;
    if (isGetInviteSuccess) {
      if (!invite) return <InvalidInvitation title="Invitation Not Found" />;
      if (invite.used)
        return <InvalidInvitation title="Invitation Already Used" />;
      if (invite.revoked)
        return <InvalidInvitation title="Invitation Revoked" />;
      if (!invite.opened) return <InviteIntro open={onOpenInviteClick} />;
      return <EnterMine password={password} invite={invite} />;
    }
    return null;
  };

  return (
    <div className={classNames("page process-page invite-page")}>
      <div className="inner-page">{renderInviteContent()}</div>
    </div>
  );
};

export default InvitePage;
