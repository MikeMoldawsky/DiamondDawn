import React, { useState, useEffect } from "react";
import classNames from "classnames";
import CRUDTable from "components/CRUDTable";
import {
  getInvitationsApi,
  createInvitationApi,
  updateInvitationApi,
} from "api/serverApi";
import NewInvitationForm from "components/NewInvitationForm";
import copy from 'copy-to-clipboard';
import {showSuccess} from "utils";

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

const getInviteLink = inviteId => `${process.env.REACT_APP_INVITE_BASE_URL}?invite=${inviteId}`;

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

  const renderActions = () => [];

  const onCreateSuccess = async () => {
    setInvitations(await getInvitationsApi());
  };

  const onRowClick = (invite) => {
    const link = getInviteLink(invite.id);
    copy(link)
    showSuccess(`Link Copied - ${link}`)
  }

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
        onRowClick={onRowClick}
        disableSelectionOnClick={false}
      />
    </div>
  );
};

export default InvitationsTab;
