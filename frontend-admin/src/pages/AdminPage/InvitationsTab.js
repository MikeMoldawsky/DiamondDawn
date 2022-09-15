import React, { useState, useEffect } from "react";
import _ from "lodash";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CRUDTable from "components/CRUDTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { utils as ethersUtils } from "ethers";
import {
  getInvitesApi,
  createInviteApi,
  updateInviteApi,
  deleteInviteApi,
} from "api/serverApi";

const INVITATION_COLUMNS = [
  {
    field: "created",
    headerName: "Created At",
    type: "dateTime",
    width: 180,
  },
  { field: "opened", headerName: "Opened At", type: "dateTime", width: 180 },
  {
    field: "revoked",
    headerName: "Expired",
    type: "boolean",
    width: 100,
  },
  {
    field: "used",
    headerName: "Used",
    type: "boolean",
    width: 100,
  },
  { field: "location", headerName: "Location", width: 150 },
  { field: "twitter", headerName: "Twitter", width: 150, editable: true },
  {
    field: "ethAddress",
    headerName: "ETH Address",
    width: 400,
    editable: true,
    preProcessEditCellProps: (params) => {
      const isValid =
        _.isEmpty(params.props.value) ||
        ethersUtils.isAddress(params.props.value);
      return { ...params.props, error: !isValid };
    },
  },
  { field: "note", headerName: "Notes", width: 300, flex: 1, editable: true },
];

const ClipboardButton = ({ inviteId }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 1000);
    }
  }, [isCopied]);

  const link = `${process.env.REACT_APP_INVITE_BASE_URL}/invite/${inviteId}`

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
    setInvitations(await getInvitesApi());
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const CRUD = {
    create: createInviteApi,
    update: updateInviteApi,
    delete: deleteInviteApi,
  };

  return (
    <div className={classNames("tab-content invitations")}>
      <h1>Invitations</h1>
      <CRUDTable
        CRUD={CRUD}
        columns={INVITATION_COLUMNS}
        rows={invitations}
        setRows={setInvitations}
        itemName="Invitation"
        getNewItem={createInviteApi}
        newCreatedOnServer
        renderActions={({ id }) => [<ClipboardButton inviteId={id} />]}
      />
    </div>
  );
};

export default InvitationsTab;
