import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CRUDTable from "components/CRUDTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  getInvitationsApi,
  createInvitationApi,
  updateInvitationApi,
} from "api/serverApi";
import NewInvitationForm from "components/NewInvitationForm";

const INVITATION_COLUMNS = [
  {
    field: "createdAt",
    headerName: "Created At",
    type: "dateTime",
    width: 180,
  },
  {
    field: "createdBy",
    headerName: "Created By",
    width: 200,
  },
  {
    field: "inviter",
    headerName: "Inviter Twitter Override",
    width: 200,
    editable: true,
  },
  {
    field: "usedBy",
    headerName: "Used By",
    width: 200,
  },
  {
    field: "revoked",
    headerName: "Revoked",
    type: "boolean",
    width: 80,
    editable: true,
  },
  {
    field: "note",
    headerName: "Notes",
    width: 300,
    flex: 1,
    editable: true,
    showIfRequest: true,
  },
];

const ClipboardButton = ({ inviteId }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 1000);
    }
  }, [isCopied]);

  const link = `${process.env.REACT_APP_INVITE_BASE_URL}?invite=${inviteId}`;

  return (
    <GridActionsCellItem
      icon={
        <CopyToClipboard text={link} onCopy={() => setIsCopied(true)}>
          <FontAwesomeIcon
            icon={faLink}
            className={classNames({ copied: isCopied })}
          />
        </CopyToClipboard>
      }
      label="Edit"
      className="textPrimary"
      color="inherit"
    />
  );
};

const InvitationsTab = () => {
  const [invitations, setInvitations] = useState([]);

  const fetchInvites = async () => {
    setInvitations(await getInvitationsApi());
  };

  useEffect(() => {
    setInvitations([]);
    fetchInvites();
  }, []);

  const CRUD = {
    create: createInvitationApi,
    update: updateInvitationApi,
  };

  const renderActions = ({ id }) => [<ClipboardButton inviteId={id} />];

  const onCreateSuccess = async () => {
    setInvitations(await getInvitationsApi());
  };

  return (
    <div className={classNames("tab-content invitations")}>
      <h1>Invitations</h1>
      <NewInvitationForm onSuccess={onCreateSuccess} />
      <CRUDTable
        CRUD={CRUD}
        columns={INVITATION_COLUMNS}
        rows={invitations}
        setRows={setInvitations}
        itemName="Invitation"
        getNewItem={createInvitationApi}
        newCreatedOnServer
        renderActions={renderActions}
      />
    </div>
  );
};

export default InvitationsTab;
