import React, { useState, useEffect } from "react";
import _ from 'lodash'
import classNames from "classnames";
import './AdminPage.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const getAllInvites = async () => {
  return [
    {
      token: 'KJHDFSD8FO8AS6DF786ASDF',
      revoked: false,
      opened: new Date(),
      password: '123456',
    },
    {
      token: 'AL9A4T7B47TBAT7BA875TB8',
      revoked: true,
      opened: new Date(),
      password: '234567',
    },
    {
      token: 'DFKAHF49O4NF947NF9477NF',
      revoked: false,
      opened: null,
      password: '345678',
    }
  ]
}

const createInvitation = async () => {
  return {
    token: 'LAULW4F7L47F847T847T4',
    revoked: false,
    opened: null,
    password: '456789',
  }
}

const InvitationRow = ({ invitation }) => {
  const { token, revoked, opened, password, account } = invitation
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 1000)
    }
  }, [isCopied])

  const hostname = window.location.hostname
  const link = `http://${hostname}${hostname === 'localhost' ? ':3000' : ''}/invite/${token}`

  return (
    <tr>
      <td>
        <CopyToClipboard text={link} onCopy={() => setIsCopied(true)}>
          <FontAwesomeIcon icon={faLink} className={classNames({copied: isCopied})} />
        </CopyToClipboard>
      </td>
      <td>{token}</td>
      <td>{revoked.toString()}</td>
      <td>{opened ? opened.toString() : '-'}</td>
      <td>{password}</td>
      <td>{account}</td>
    </tr>
  )
}

const AdminPage = () => {
  const [invites, setInvites] = useState([])

  useEffect(() => {
    const fetch = async () => {
      setInvites(await getAllInvites())
    }
    fetch()
  }, [])

  const generate = async () => {
    const invitation = await createInvitation()
    setInvites([...invites, invitation])
  }

  return (
    <div className={classNames("page admin-page")}>
      <h1>Invitations</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Token</th>
            <th>Revoked</th>
            <th>Opened</th>
            <th>Password</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invitation, i) => (
            <InvitationRow key={`invite-${i}`} invitation={invitation} />
          ))}
        </tbody>
      </table>
      <div className="button" onClick={generate}>GENERATE INVITE</div>
    </div>
  );
};

export default AdminPage;
