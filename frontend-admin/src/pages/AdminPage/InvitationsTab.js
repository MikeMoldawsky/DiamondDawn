import React, { useState, useEffect } from "react";
import _ from 'lodash'
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faRemove, faPlus } from "@fortawesome/free-solid-svg-icons";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import axios from 'axios'
import CRUDTable from "components/CRUDTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import useDDContract from "hooks/useDDContract";
import ActionButton from "components/ActionButton";
import { EVENTS } from "consts";
import { watchWhitelist, whitelistSelector } from "store/whitelistReducer";
import { useDispatch, useSelector } from "react-redux";
import { utils as ethersUtils } from 'ethers'

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

const updateInvite = async (invite) => {
  try {
    const { data } = await axios.post(`/api/update_invite`, invite)
    return data
  } catch (e) {
    return null
  }
}

const deleteInvite = async (inviteId) => {
  try {
    const { data } = await axios.post(`/api/delete_invite`, { inviteId })
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

  const [invitations, setInvitations] = useState([])
  const contract = useDDContract()
  const whitelist = useSelector((whitelistSelector))
  const dispatch = useDispatch()

  useEffect(() => {
    const fetch = async () => {
      setInvitations(await getAllInvites())
    }
    fetch()

    dispatch(watchWhitelist(contract))

    return () => {
      contract.removeListener(EVENTS.WhitelistUpdated)
    }
  }, [])

  const columns = [
    { field: 'twitter', headerName: 'Twitter', width: 150, editable: true },
    { field: 'password', headerName: 'Password', width: 150 },
    { field: 'created', headerName: 'Created At', type: 'dateTime', width: 180 },
    { field: 'revoked', headerName: 'Revoked', type: 'boolean', width: 100, editable: true },
    { field: 'opened', headerName: 'Opened At', type: 'dateTime', width: 180 },
    { field: 'location', headerName: 'Location', width: 150 },
    {
      field: 'ethAddress', headerName: 'ETH Address', width: 200, editable: true,
      preProcessEditCellProps: (params) => {
        const isValid = _.isEmpty(params.props.value) || ethersUtils.isAddress(params.props.value);
        return { ...params.props, error: !isValid };
      },
    },
    { field: 'whitelisted', headerName: 'Whitelisted', width: 100 },
    { field: 'note', headerName: 'Notes', width: 300, flex: 1, editable: true },
  ];

  const CRUD = {
    create: createInvitation,
    // read: getAllInvites,
    update: updateInvite,
    delete: deleteInvite,
  }

  const addToWL = async selectedRows => {
    try {
      const addresses = selectedRows.map(r => r.ethAddress)
      const tx = await contract.addToAllowList(addresses)
      const receipt = await tx.wait()
    }
    catch (e) {
      console.error('addToWL Failed', { e })
    }
  }

  const removeFromWL = async selectedRows => {
    try {
      const addresses = selectedRows.map(r => r.ethAddress)
      const tx = await contract.removeFromAllowList(addresses)
      const receipt = await tx.wait()
    }
    catch (e) {
      console.error('removeFromWL Failed', { e })
    }
  }

  const renderButtons = selectedRows => {
    const disabled = selectedRows.length === 0
    return (
      <div className="center-aligned-row">
        <ActionButton actionKey="Add To WL" className="link save-button" disabled={disabled} onClick={() => addToWL(selectedRows)}>
          <FontAwesomeIcon icon={faPlus} /> Add To WL
        </ActionButton>
        <ActionButton actionKey="Remove From WL" className="link save-button" disabled={disabled} onClick={() => removeFromWL(selectedRows)}>
          <FontAwesomeIcon icon={faRemove} /> Remove From WL
        </ActionButton>
      </div>
    )
  }

  const processedRows = invitations.map(i => ({ ...i, whitelisted: _.get(whitelist, i.ethAddress, 'No') }))

  return (
    <div className={classNames("tab-content invitations")}>
      <h1>Invitations</h1>
      {processedRows.length > 0 && (
        <CRUDTable CRUD={CRUD}
                   columns={columns}
                   rows={processedRows}
                   setRows={setInvitations}
                   isRowSelectable={({ row }) => !!row.ethAddress}
                   itemName="Invitation"
                   getNewItem={createInvitation}
                   newCreatedOnServer
                   renderActions={({ id }) => [<ClipboardButton inviteId={id} />]}
                   renderButtons={renderButtons} />
      )}
    </div>
  );
};

export default InvitationsTab;
