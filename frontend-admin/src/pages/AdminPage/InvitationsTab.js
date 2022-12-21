import React, { useState, useEffect } from "react";
import classNames from "classnames";
import CRUDTable from "components/CRUDTable";
import {
  getInvitationsApi,
  createInvitationApi,
  updateInvitationApi,
  approveCollectorApi,
  getDDCollectorApi,
} from "api/serverApi";
import NewInvitationForm from "components/NewInvitationForm";
import copy from "copy-to-clipboard";
import { showSuccess } from "utils";
import _ from "lodash";
import { TwitterLink } from "components/Links";
import format from "date-fns/format";
import useActionDispatch from "hooks/useActionDispatch";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const getInviteLink = (inviteId) =>
  `${process.env.REACT_APP_INVITE_BASE_URL}?invite=${inviteId}`;

const renderCellWithTooltip = (params) => (
  <span title={params.value}>{params.value}</span>
);

const INVITATION_COLUMNS = [
  {
    field: "createdAt",
    headerName: "Created At",
    type: "dateTime",
    width: 150,
    valueFormatter: (params) =>
      format(new Date(params.value), "dd/MM/yy hh:mm"),
  },
  {
    field: "inviter",
    headerName: "Inviter Twitter",
    width: 150,
    editable: true,
    renderCell: (params) => <TwitterLink handle={params.row.inviter} />,
  },
  {
    field: "note",
    headerName: "Notes",
    flex: 1,
    editable: true,
    showIfRequest: true,
    renderCell: renderCellWithTooltip,
  },
  {
    field: "sent",
    headerName: "Sent",
    type: "boolean",
    width: 80,
    editable: true,
  },
  {
    field: "viewed",
    headerName: "Viewed",
    type: "boolean",
    width: 80,
  },
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
  {
    field: "link",
    headerName: "Invite Link",
    width: 250,
    valueGetter: ({ id }) => getInviteLink(id),
  },
];

const SendButton = ({ inviteId, onSent }) => {
  const setSent = async () => {
    if (window.confirm("Did you send the invitation?")) {
      await updateInvitationApi({ _id: inviteId, sent: true });
      onSent();
    }
  };

  return (
    <GridActionsCellItem
      icon={<FontAwesomeIcon icon={faPaperPlane} />}
      onClick={setSent}
      label="Send"
      className="textPrimary"
      color="inherit"
    />
  );
};

const InvitationsTab = () => {
  const [_invitations, setInvitations] = useState([]);
  const [ddCollector, setDDCollector] = useState([]);
  const [showPrivateInvites, setShowPrivateInvites] = useState(false);
  const actionDispatch = useActionDispatch();

  const invitations = showPrivateInvites
    ? _invitations
    : _.filter(_invitations, ({ createdBy }) => createdBy === ddCollector._id);

  const fetchInvites = () => {
    actionDispatch(
      async () => setInvitations(await getInvitationsApi()),
      "load-invitations"
    );
  };

  const fetchDDCollector = async () => {
    setDDCollector(await getDDCollectorApi());
  };

  useEffect(() => {
    setInvitations([]);
    fetchInvites();
    fetchDDCollector();
  }, []);

  const CRUD = {
    create: createInvitationApi,
    update: updateInvitationApi,
  };

  const setInviteSent = (inviteId) => {
    setInvitations(
      _.map(invitations, (invite) => {
        return invite._id === inviteId ? { ...invite, sent: true } : invite;
      })
    );
  };

  const renderActions = ({ id, row }) => {
    return row.sent || row.createdBy !== ddCollector._id
      ? []
      : [<SendButton inviteId={id} onSent={() => setInviteSent(id)} />];
  };

  const onCreateSuccess = async () => {
    setInvitations(await getInvitationsApi());
  };

  const isRowSelectable = ({ row }) => {
    return !row.sent;
  };

  const onRowClick = ({ row }) => {
    const link = getInviteLink(row._id);
    copy(link);
    showSuccess(`Link Copied - ${link}`);
  };

  const getRowClassName = ({ row }) =>
    isRowSelectable({ row }) ? "" : "disabled";

  return (
    <div className={classNames("tab-content invitations")}>
      <h1>Invitations</h1>
      <NewInvitationForm
        onSuccess={onCreateSuccess}
        ddCollector={ddCollector}
      />
      <div className="filters">
        <div className="filter">
          <input
            type="checkbox"
            checked={showPrivateInvites}
            onChange={() => setShowPrivateInvites(!showPrivateInvites)}
          />
          Show Private Invites
        </div>
      </div>
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
        getRowClassName={getRowClassName}
        loadActionKey="load-invitations"
      />
    </div>
  );
};

export default InvitationsTab;
