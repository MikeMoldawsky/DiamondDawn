import React, { useState, useEffect } from "react";
import _ from 'lodash'
import classNames from "classnames";
import './InvitePage.scss'
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const getInvite = async (token) => {
  return {
    revoked: false,
    opened: new Date(),
    password: '123456',
  }
}

const openInvite = async (onOpen) => {
  onOpen()
}

const InvitationNotFound = () => (
  <>
    <h1>Invitation not found</h1>
    <div className="text-center">For another invitation please DM Diamonds Dawn on twitter</div>
    <a target="_blank" rel="noreferrer" href="https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20">
      <div className="button">Request Invitation</div>
    </a>
  </>
)

const InvitationRevoked = () => (
  <>
    <h1>Invitation expired</h1>
    <div className="text-center">For another invitation please DM Diamonds Dawn on twitter</div>
    <a target="_blank" rel="noreferrer" href="https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20">
      <div className="button">Request Invitation</div>
    </a>
  </>
)

const InviteIntro = ({ showInvitation }) => (
  <>
    <h1>You Are Invited to Diamonds Dawn!</h1>
    <div className="warning-message">
      <FontAwesomeIcon icon={faExclamationTriangle} />
      <div className="warning-text">
        The invitation can be opened one time only and will be revoked once opened.<br />Please make sure you have the time before opening the invitation
      </div>
    </div>
    <div className="button" onClick={() => openInvite(showInvitation)}>OPEN INVITATION</div>
  </>
)

const InvitePage = () => {
  const { token } = useParams()
  const [invite, setInvite] = useState(null)
  const [showInvite, setShowInvite] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setInvite(await getInvite(token))
    }
    fetch()
  }, [token])

  const renderInviteContent = () => {
    if (_.isNil(invite)) return (<InvitationNotFound />)
    if (invite.revoked) return (<InvitationRevoked />)
    if (!showInvite) return (<InviteIntro showInvitation={() => setShowInvite(true)} />)
    return (
      <>
        <h1>You Are Invited to Diamonds Dawn!</h1>
        <div>Your Password is {invite.password}</div>
        <a target="_blank" rel="noreferrer" href="https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20">
          <div className="button">Join Waiting List</div>
        </a>
      </>
    )
  }

  return (
    <div className={classNames("page invite-page")}>
      {renderInviteContent()}
    </div>
  );
};

export default InvitePage;
