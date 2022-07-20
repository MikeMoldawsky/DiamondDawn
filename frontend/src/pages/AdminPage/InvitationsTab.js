import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faUpload } from "@fortawesome/free-solid-svg-icons";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import axios from 'axios'
import CRUDTable from "components/CRUDTable";
import { GridActionsCellItem } from "@mui/x-data-grid";

const getAllInvites = async () => {
  try {
    const res = await axios.get(`/api/get_invites`)
    return res.data
  } catch (e) {
    return []
  }
}

const createInvitation = async () => {
  try {
    const res = await axios.post(`/api/create_invite`)
    return res.data
  } catch (e) {
    return null
  }
}

const updateInvite = async (diamond) => {
  try {
    const { data } = await axios.post(`/api/update_invite`, diamond)
    return data
  } catch (e) {
    return null
  }
}

const deleteInvite = async (diamondId) => {
  try {
    const { data } = await axios.post(`/api/delete_invite`, { diamondId })
    return data
  } catch (e) {
    return null
  }
}

const ClipboardButton = ({ inviteId }) => {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 1000)
    }
  }, [isCopied])

  const hostname = window.location.hostname
  const link = `http://${hostname}${hostname === 'localhost' ? ':3000' : ''}/invite/${inviteId}`

  return (
    <GridActionsCellItem
      icon={(
        <CopyToClipboard text={link} onCopy={() => setIsCopied(true)}>
          <FontAwesomeIcon icon={faLink} className={classNames({copied: isCopied})} />
        </CopyToClipboard>
      )}
      label="Edit"
      className="textPrimary"
      color="inherit"
    />
  )
}

const InvitationsTab = () => {

  const columns = [
    { field: 'twitter', headerName: 'Twitter', width: 150, editable: true },
    { field: 'password', headerName: 'Password', width: 150 },
    { field: 'created', headerName: 'Created At', type: 'dateTime', width: 180 },
    { field: 'revoked', headerName: 'Revoked', type: 'boolean', width: 100, editable: true },
    { field: 'opened', headerName: 'Opened At', type: 'dateTime', width: 180 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'ethAddress', headerName: 'ETH Address', width: 200, editable: true },
    { field: 'whitelisted', headerName: 'Whitelisted', type: 'boolean', width: 100 },
    { field: 'note', headerName: 'Notes', width: 300, flex: 1, editable: true },
  ];

  const CRUD = {
    create: createInvitation,
    read: getAllInvites,
    update: updateInvite,
    delete: deleteInvite,
  }

  return (
    <div className={classNames("tab-content invitations")}>
      <h1>Invitations</h1>
      <CRUDTable CRUD={CRUD}
                 columns={columns}
                 itemName="Invitation"
                 getNewItem={createInvitation}
                 newCreatedOnServer
                 renderActions={({ id }) => [<ClipboardButton inviteId={id} />]}
                 renderButtons={() => (
                   <div className="button link save-button">
                     <FontAwesomeIcon icon={faUpload} /> Deploy
                   </div>
                 )} />
    </div>
  );
};

export default InvitationsTab;
