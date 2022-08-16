import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./InvitePage.scss";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import getLocation from "utils/getLocation";
import {getPasswordApi} from "api/serverApi";

const openInvite = async (inviteId) => {
  try {
    const { country, state } = getLocation();
    const res = await axios.post(`/api/open_invite`, {
      inviteId,
      country,
      state,
    });
    return res.data;
  } catch (e) {
    return null;
  }
};

const isInviteRevoked = async (inviteId) => {
  try {
    const res = await axios.post(`/api/is_invite_revoked`, { inviteId });
    return res.data;
  } catch (e) {
    return true;
  }
};

const InvitationNotFound = () => (
  <>
    <h1>Invitation not found</h1>
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
    <div className="button" onClick={open}>
      OPEN INVITATION
    </div>
  </>
);

const InvitePage = () => {
  const { inviteId } = useParams();
  const [invite, setInvite] = useState(null);
  const [password, setPassword] = useState(null);
  const [isRevoked, setIsRevoked] = useState(null);

  const getPasswordForInvite = async () => {
    setPassword(await getPasswordApi(inviteId))
  }

  useEffect(() => {
    const fetch = async () => {
      setIsRevoked(await isInviteRevoked(inviteId));
    };
    if (inviteId) {
      fetch();
      getPasswordForInvite()
    }
  }, [inviteId]);

  const onOpenInviteClick = async () => {
    setInvite(await openInvite(inviteId));
  };

  const renderInviteContent = () => {
    if (isRevoked === null) return null;

    if (isRevoked) return <InvitationRevoked />;
    // if (_.isNil(invite)) return (<InvitationNotFound />)
    if (!invite) return <InviteIntro open={onOpenInviteClick} />;
    return (
      <>
        <h1>You Are Invited to Diamonds Dawn!</h1>
        <div>Your Password is {password}</div>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20"
        >
          <div className="button">Join Waiting List</div>
        </a>
      </>
    );
  };

  return (
    <div className={classNames("page invite-page")}>
      {renderInviteContent()}
    </div>
  );
};

export default InvitePage;
