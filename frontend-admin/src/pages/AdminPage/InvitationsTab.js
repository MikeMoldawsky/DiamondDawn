import React, { useState, useEffect } from "react";
import _ from "lodash";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLink } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CRUDTable from "components/CRUDTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { utils as ethersUtils } from "ethers";
import {
  createInviteApi,
  updateInviteApi,
  deleteInviteApi,
  getInvitesApi,
} from "api/serverApi";
import RequestForm from "components/RequestForm";

const INVITATION_COLUMNS = [
  {
    field: "created",
    headerName: "Created At",
    type: "dateTime",
    width: 180,
    showIfRequest: true,
  },
  {
    field: "approved",
    headerName: "Approved",
    type: "boolean",
    width: 100,
    editable: true,
    showIfRequest: true,
  },
  { field: "opened", headerName: "Opened At", type: "dateTime", width: 180 },
  { field: "signed", headerName: "Signed", type: "boolean", width: 80 },
  {
    field: "used",
    headerName: "Used",
    type: "boolean",
    width: 80,
  },
  {
    field: "revoked",
    headerName: "Expired",
    type: "boolean",
    width: 80,
  },
  {
    field: "identifier",
    headerName: "Twitter/Email",
    width: 200,
    editable: true,
    showIfRequest: true,
  },
  {
    field: "address",
    headerName: "Address",
    width: 400,
    showIfRequest: true,
    preProcessEditCellProps: (params) => {
      const isValid =
        _.isEmpty(params.props.value) ||
        ethersUtils.isAddress(params.props.value);
      return { ...params.props, error: !isValid };
    },
  },
  {
    field: "location",
    headerName: "Location",
    width: 150,
    showIfRequest: true,
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

  const link = `${process.env.REACT_APP_INVITE_BASE_URL}/invite/${inviteId}`;

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

const ApproveButton = ({ inviteId, onApprove }) => {
  const approve = async () => {
    await updateInviteApi({ _id: inviteId, approved: true });
    onApprove();
  };

  return (
    <GridActionsCellItem
      icon={<FontAwesomeIcon icon={faCheck} onClick={approve} />}
      label="Edit"
      className="textPrimary"
      color="inherit"
    />
  );
};

const InvitationsTab = ({ approved }) => {
  const [invitations, setInvitations] = useState([]);

  const fetchInvites = async () => {
    setInvitations(await getInvitesApi(approved));
  };

  useEffect(() => {
    setInvitations([]);
    fetchInvites();
  }, [approved]);

  const CRUD = {
    create: createInviteApi,
    update: updateInviteApi,
    delete: deleteInviteApi,
  };

  const columns = approved
    ? INVITATION_COLUMNS
    : _.filter(INVITATION_COLUMNS, ({ showIfRequest }) => showIfRequest);

  const setApproved = (inviteId) => {
    setInvitations(
      _.map(invitations, (invite) => {
        return invite._id === inviteId ? { ...invite, approved: true } : invite;
      })
    );
  };

  const renderActions = ({ id }) =>
    approved
      ? [<ClipboardButton inviteId={id} />]
      : [<ApproveButton inviteId={id} onApprove={() => setApproved(id)} />];

  const onCreateSuccess = async () => {
    setInvitations(await getInvitesApi(approved));
  };

  return (
    <div className={classNames("tab-content invitations")}>
      <h1>Invitations</h1>
      {approved && (
        <RequestForm
          createInviteApi={createInviteApi}
          optionalIdentity
          text="create Invitation"
          onSuccess={onCreateSuccess}
        />
      )}
      <CRUDTable
        CRUD={CRUD}
        columns={columns}
        rows={invitations}
        setRows={setInvitations}
        itemName="Invitation"
        getNewItem={createInviteApi}
        newCreatedOnServer
        renderActions={renderActions}
      />
    </div>
  );
};

export default InvitationsTab;
