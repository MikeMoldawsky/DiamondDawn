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
import _ from "lodash"
import {TwitterLink} from "components/Links";
import format from "date-fns/format";
import useActionDispatch from "hooks/useActionDispatch";


const INVITATION_COLUMNS = [
  {
    field: "createdAt",
    headerName: "Created At",
    type: "dateTime",
    width: 150,
    valueFormatter: (params) => format(new Date(params.value), "dd/MM/yy hh:mm"),
  },
  // {
  //   field: "createdBy",
  //   headerName: "Created By",
  //   width: 200,
  // },
  {
    field: "inviter",
    headerName: "Inviter Twitter Override",
    width: 150,
    editable: true,
    renderCell: (params) => <TwitterLink handle={params.row.inviter} />,
  },
  {
    field: "note",
    headerName: "Notes",
    width: 300,
    flex: 1,
    editable: true,
    showIfRequest: true,
  },
  // {
  //   field: "usedBy",
  //   headerName: "Used By",
  //   width: 200,
  // },
  {
    field: "usedBy",
    headerName: "Used",
    type: "boolean",
    width: 80,
    valueFormatter: (params) => !_.isEmpty(params.value),
  },
  {
    field: "revoked",
    headerName: "Revoked",
    type: "boolean",
    width: 80,
    editable: true,
  },
];

const getInviteLink = inviteId => `${process.env.REACT_APP_INVITE_BASE_URL}?invite=${inviteId}`;

const InvitationsTab = () => {
  const [invitations, setInvitations] = useState([]);
  const actionDispatch = useActionDispatch()

  const fetchInvites = () => {
    actionDispatch(
      async () => setInvitations(await getInvitationsApi()),
      "load-invitations",
    )
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

  const isRowSelectable = ({row}) => {
    return _.isEmpty(row.usedBy)
  }

  const onRowClick = ({ row }) => {
    if (!isRowSelectable({row})) return

    const link = getInviteLink(row.id);
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
        isRowSelectable={isRowSelectable}
        getRowClassName={({ row }) => isRowSelectable({ row }) ? "" : "disabled"}
        loadActionKey="load-invitations"
      />
    </div>
  );
};

export default InvitationsTab;
