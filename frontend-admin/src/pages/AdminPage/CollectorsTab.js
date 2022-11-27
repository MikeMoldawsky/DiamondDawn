import React, { useState, useEffect } from "react";
import _ from "lodash";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import CRUDTable from "components/CRUDTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { utils as ethersUtils } from "ethers";
import {
  approveCollectorApi,
  getCollectorsApi,
  updateCollectorApi,
} from "api/serverApi";

const INVITATION_COLUMNS = [
  {
    field: "createdAt",
    headerName: "Created At",
    type: "dateTime",
    width: 180,
    showIfRequest: true,
  },
  {
    field: "twitter",
    headerName: "Twitter",
    width: 200,
    editable: true,
    showIfRequest: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    editable: true,
    showIfRequest: true,
  },
  {
    field: "invitedBy",
    headerName: "Invited By",
    width: 200,
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
    field: "isDao",
    headerName: "DAO",
    type: "boolean",
    width: 100,
    showIfRequest: true,
  },
  {
    field: "approved",
    headerName: "Approved",
    type: "boolean",
    width: 100,
    showIfRequest: true,
    editable: true,
  },
  {
    field: "mintWindowStart",
    headerName: "Mint Window Start",
    type: "dateTime",
    width: 180,
  },
  {
    field: "minted",
    headerName: "Minted",
    type: "boolean",
    width: 80,
  },
  {
    field: "expired",
    headerName: "Expired",
    type: "boolean",
    width: 80,
  },
  {
    field: "invitations",
    headerName: "Invitations",
    width: 200,
    preProcessEditCellProps: (params) => {
      return { ...params.props, value: params.props.value.join(",") };
    },
  },
];

const ApproveButton = ({ collectorId, onApprove }) => {
  const approve = async () => {
    if (window.confirm("Are you sure you want to approve this collector?")) {
      await approveCollectorApi(collectorId);
      onApprove();
    }
  };

  return (
    <GridActionsCellItem
      icon={<FontAwesomeIcon icon={faCheck} onClick={approve} />}
      label="Approve"
      className="textPrimary"
      color="inherit"
    />
  );
};

const InvitationsTab = ({ approved }) => {
  const [collectors, setCollectors] = useState([]);

  const fetchCollectors = async () => {
    setCollectors(await getCollectorsApi(approved));
  };

  useEffect(() => {
    setCollectors([]);
    fetchCollectors();
  }, [approved]);

  const CRUD = {
    update: updateCollectorApi,
  };

  const columns = approved
    ? INVITATION_COLUMNS
    : _.filter(INVITATION_COLUMNS, ({ showIfRequest }) => showIfRequest);

  const setApproved = (inviteId) => {
    setCollectors(
      _.map(collectors, (invite) => {
        return invite._id === inviteId ? { ...invite, approved: true } : invite;
      })
    );
  };

  const renderActions = ({ id }) =>
    approved
      ? []
      : [<ApproveButton collectorId={id} onApprove={() => setApproved(id)} />];

  return (
    <div className={classNames("tab-content invitations")}>
      <h1>{approved ? "Approved" : "Pending"} Collectors</h1>
      <CRUDTable
        CRUD={CRUD}
        columns={columns}
        rows={collectors}
        setRows={setCollectors}
        itemName="Collector"
        newCreatedOnServer
        renderActions={renderActions}
      />
    </div>
  );
};

export default InvitationsTab;
