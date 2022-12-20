import React, { useState, useEffect } from "react";
import _ from "lodash";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye } from "@fortawesome/free-solid-svg-icons";
import CRUDTable from "components/CRUDTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { utils as ethersUtils } from "ethers";
import {
  approveCollectorApi,
  getCollectorsApi,
  updateCollectorApi,
} from "api/serverApi";
import format from "date-fns/format";
import { OpenseaLink, TwitterLink } from "components/Links";
import useActionDispatch from "hooks/useActionDispatch";
import { COLLECTOR_STATUS } from "consts";

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
    field: "twitter",
    headerName: "Twitter",
    width: 200,
    editable: true,
    renderCell: (params) => <TwitterLink handle={params.row.twitter} />,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    editable: true,
    renderCell: renderCellWithTooltip,
  },
  {
    field: "invitedBy",
    headerName: "Invited By",
    width: 200,
    renderCell: (params) => <TwitterLink handle={params.row.invitedBy} />,
  },
  {
    field: "note",
    headerName: "Notes",
    minWidth: 300,
    flex: 2,
    editable: true,
    renderCell: renderCellWithTooltip,
  },
  {
    field: "status",
    headerName: "Status",
    type: "singleSelect",
    valueOptions: (params) => {
      console.log({ params });
      switch (params.row.status) {
        case COLLECTOR_STATUS.Applied:
          return [COLLECTOR_STATUS.Applied, COLLECTOR_STATUS.InReview];
        case COLLECTOR_STATUS.Approved:
          return [COLLECTOR_STATUS.Approved];
        default:
          return [
            COLLECTOR_STATUS.InReview,
            COLLECTOR_STATUS.Maybe,
            COLLECTOR_STATUS.Rejected,
            COLLECTOR_STATUS.ToApprove,
          ];
      }
    },
    width: 150,
    editable: true,
    hideIfApproved: true,
  },
  {
    field: "statusInfo",
    headerName: "Status Info",
    minWidth: 300,
    editable: true,
    renderCell: renderCellWithTooltip,
  },
  {
    field: "buyProbability",
    headerName: "Buy Probability",
    type: "singleSelect",
    valueOptions: [1, 2, 3, 4, 5],
    width: 150,
    editable: true,
  },
  {
    field: "address",
    headerName: "Address",
    width: 400,
    preProcessEditCellProps: (params) => {
      const isValid =
        _.isEmpty(params.props.value) ||
        ethersUtils.isAddress(params.props.value);
      return { ...params.props, error: !isValid };
    },
    renderCell: (params) => <OpenseaLink address={params.row.address} />,
  },
  {
    field: "location",
    headerName: "Location",
    width: 200,
    renderCell: renderCellWithTooltip,
  },
  {
    field: "isDao",
    headerName: "DAO",
    type: "boolean",
    width: 100,
  },
  {
    field: "approved",
    headerName: "Approved",
    type: "boolean",
    width: 100,
    editable: true,
  },
  {
    field: "mintWindowStart",
    headerName: "Mint Window Start",
    type: "dateTime",
    width: 180,
    hideIfPending: true,
  },
  {
    field: "minted",
    headerName: "Minted",
    type: "boolean",
    width: 80,
    hideIfPending: true,
  },
  {
    field: "expired",
    headerName: "Expired",
    type: "boolean",
    width: 80,
    hideIfPending: true,
  },
  {
    field: "invitations",
    headerName: "Invitations",
    width: 200,
    preProcessEditCellProps: (params) => {
      return { ...params.props, value: params.props.value.join(",") };
    },
    hideIfPending: true,
  },
];

const ReviewButton = ({ collectorId, onSuccess }) => {
  const review = async () => {
    if (window.confirm('Set collector to "InReview"?')) {
      await updateCollectorApi({
        _id: collectorId,
        status: COLLECTOR_STATUS.InReview,
      });
      onSuccess();
    }
  };

  return (
    <GridActionsCellItem
      icon={<FontAwesomeIcon icon={faEye} />}
      onClick={review}
      label="Review"
      className="textPrimary"
      color="inherit"
    />
  );
};

const ApproveButton = ({ collectorId, onSuccess }) => {
  const approve = async () => {
    if (window.confirm("Are you sure you want to approve this collector?")) {
      await approveCollectorApi(collectorId);
      onSuccess();
    }
  };

  return (
    <GridActionsCellItem
      icon={<FontAwesomeIcon icon={faCheck} />}
      onClick={approve}
      label="Approve"
      className="textPrimary"
      color="inherit"
    />
  );
};

const InvitationsTab = ({ approved }) => {
  const [collectors, setCollectors] = useState([]);
  const actionDispatch = useActionDispatch();

  const fetchCollectors = () => {
    actionDispatch(
      async () => setCollectors(await getCollectorsApi(approved)),
      "load-collectors"
    );
  };

  useEffect(() => {
    setCollectors([]);
    fetchCollectors();
  }, [approved]);

  const CRUD = {
    update: updateCollectorApi,
  };

  const columns = _.filter(
    INVITATION_COLUMNS,
    ({ hideIfPending, hideIfApproved }) =>
      approved ? !hideIfApproved : !hideIfPending
  );

  const setLocalCollector = (id, update) => {
    setCollectors(
      _.map(collectors, (collector) => {
        return collector._id === id ? { ...collector, ...update } : collector;
      })
    );
  };

  const renderActions = ({ id, row }) => {
    const actions = [];
    if (approved) return actions;

    if (row.status === COLLECTOR_STATUS.Applied) {
      actions.push(
        <ReviewButton
          collectorId={id}
          onSuccess={() =>
            setLocalCollector(id, { status: COLLECTOR_STATUS.InReview })
          }
        />
      );
    }
    actions.push(
      <ApproveButton
        collectorId={id}
        onSuccess={() =>
          setLocalCollector(id, {
            approved: true,
            status: COLLECTOR_STATUS.Approved,
          })
        }
      />
    );
    return actions;
  };

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
        loadActionKey="load-collectors"
        omitUpdateFields={["invitedBy"]}
      />
    </div>
  );
};

export default InvitationsTab;
