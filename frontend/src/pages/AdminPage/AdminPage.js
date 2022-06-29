import React, { useState, useEffect } from "react";
import _ from 'lodash'
import classNames from "classnames";
import './AdminPage.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { API_URL } from 'config'
import axios from 'axios'

const getAllInvites = async () => {
  try {
    const res = await axios.get(`${API_URL}/get_invites`)
    return res.data
  } catch (e) {
    return []
  }
}

const createInvitation = async () => {
  try {
    const res = await axios.get(`${API_URL}/create_invite`)
    return res.data
  } catch (e) {
    return null
  }
}

const InvitationRow = ({ invitation }) => {
  const { _id, revoked, opened, password, account } = invitation
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 1000)
    }
  }, [isCopied])

  const hostname = window.location.hostname
  const link = `http://${hostname}${hostname === 'localhost' ? ':3000' : ''}/invite/${_id}`

  return (
    <tr>
      <td>
        <CopyToClipboard text={link} onCopy={() => setIsCopied(true)}>
          <FontAwesomeIcon icon={faLink} className={classNames({copied: isCopied})} />
        </CopyToClipboard>
      </td>
      <td>{_id}</td>
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
    if (invitation) {
      setInvites([...invites, invitation])
    }
  }

  return (
    <div className={classNames("page admin-page")}>
      <h1>Invitations</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
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
