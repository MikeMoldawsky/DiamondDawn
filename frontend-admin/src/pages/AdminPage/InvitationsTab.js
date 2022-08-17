import React, { useState, useEffect } from "react";
import _ from "lodash";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faUpload } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CRUDTable from "components/CRUDTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import useDDContract from "hooks/useDDContract";
import { useDispatch } from "react-redux";
import { utils as ethersUtils } from "ethers";
import {
  getInvitesApi,
  createInviteApi,
  updateInviteApi,
  deleteInviteApi,
} from "api/serverApi";
import { allowMineEntranceApi, toPasswordHash } from "api/contractApi";

const INVITATION_COLUMNS = [
  { field: "twitter", headerName: "Twitter", width: 150, editable: true },
  { field: "password", headerName: "Password", width: 150 },
  { field: "hash", headerName: "Hash", width: 600 },
  {
    field: "created",
    headerName: "Created At",
    type: "dateTime",
    width: 180,
  },
  {
    field: "revoked",
    headerName: "Revoked",
    type: "boolean",
    width: 100,
    editable: true,
  },
  { field: "opened", headerName: "Opened At", type: "dateTime", width: 180 },
  { field: "location", headerName: "Location", width: 150 },
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

  const hostname = window.location.hostname;
  const link = `http://${hostname}${
    hostname === "localhost" ? ":3000" : ""
  }/invite/${inviteId}`;

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
  const contract = useDDContract();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      const invites = await getInvitesApi();
      setInvitations(
        invites.map((invite) => {
          console.log(invite)
          return {
            ...invite,
            hash: toPasswordHash(invite.password),
          };
        })
      );
    };
    fetch();
  }, [contract, dispatch]);

  const CRUD = {
    create: createInviteApi,
    update: updateInviteApi,
    delete: deleteInviteApi,
  };

  const renderDeployButton = (selectedRows) => (
    <div
      className="button link save-button"
      onClick={() => {
        allowMineEntranceApi(contract, _.map(selectedRows, "password"));
      }}
    >
      <FontAwesomeIcon icon={faUpload} /> Deploy
    </div>
  );

  return (
    <div className={classNames("tab-content invitations")}>
      <h1>Invitations</h1>
      <CRUDTable
        CRUD={CRUD}
        columns={INVITATION_COLUMNS}
        rows={invitations}
        setRows={setInvitations}
        isRowSelectable={({ row }) => !!row.ethAddress}
        itemName="Invitation"
        getNewItem={createInviteApi}
        newCreatedOnServer
        renderActions={({ id }) => [<ClipboardButton inviteId={id} />]}
        renderButtons={renderDeployButton}
      />
    </div>
  );
};

export default InvitationsTab;
