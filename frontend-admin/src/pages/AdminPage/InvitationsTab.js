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
  createPasswordsApi, countPasswordsApi,
} from "api/serverApi";
import keccak256 from "keccak256";
import { allowMineEntranceApi, populateDiamondsApi } from "api/contractApi";

const INVITATION_COLUMNS = [
  { field: "twitter", headerName: "Twitter", width: 150, editable: true },
  // { field: "password", headerName: "Password", width: 150 },
  // { field: "hash", headerName: "Hash", width: 600 },
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
  const [passwordCount, setPasswordCount] = useState({});
  const contract = useDDContract();
  const dispatch = useDispatch();

  const fetchInvites = async () => {
    setInvitations(await getInvitesApi())
    // const invites = await getInvitesApi();
    // setInvitations(
    //   invites.map((invite) => {
    //     return {
    //       ...invite,
    //       // hash: keccak256(ethersUtils.formatBytes32String(invite.password)),
    //       hash: keccak256(invite.password).toString("hex"),
    //     };
    //   })
    // );
  };

  const fetchPasswordCount = async () => {
    const available = await countPasswordsApi('available')
    const pending = await countPasswordsApi('pending')
    const used = await countPasswordsApi('used')
    setPasswordCount({
      available,
      pending,
      used,
      total: available + pending + used,
    })
  };

  const createPasswords = async () => {
    await createPasswordsApi(333)
    fetchPasswordCount()
  }

  useEffect(() => {
    fetchInvites();
    fetchPasswordCount()
  }, [contract, dispatch]);

  const CRUD = {
    create: createInviteApi,
    update: updateInviteApi,
    delete: deleteInviteApi,
  };

  const renderDeployButton = (selectedRows) => (
    <div
      className="button link save-button"
      onClick={() =>
        allowMineEntranceApi(contract, _.map(selectedRows, "hash"))
      }
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
      <h1>Passwords</h1>
      <div>Available Password: {passwordCount.available}</div>
      <div>Pending Password: {passwordCount.pending}</div>
      <div>Used Password: {passwordCount.used}</div>
      <div>Total Password: {passwordCount.total}</div>
      <div className="button link" onClick={createPasswords}>CREATE PASSWORDS</div>
    </div>
  );
};

export default InvitationsTab;
