import React, { useState, useEffect } from "react";
import _ from "lodash";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import CRUDTable from "components/CRUDTable";
import { GridActionsCellItem, useGridApiContext } from "@mui/x-data-grid";
import { utils as ethersUtils } from "ethers";
import {
  approveCollectorApi,
  getCollectorsApi,
  updateCollectorApi,
} from "api/serverApi";
import format from "date-fns/format";
import { EtherscanLink, OpenseaLink, TwitterLink } from "components/Links";
import useActionDispatch from "hooks/useActionDispatch";
import { COLLECTOR_STATUS } from "consts";

const renderCellWithTooltip = (params) => (
  <span title={params.value}>{params.value}</span>
);

const MultilineTextEdit = (props) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleValueChange = (event) => {
    const newValue = event.target.value; // The new value entered by the user
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <textarea
      className="cell-edit"
      value={value}
      onChange={handleValueChange}
    />
  );
};

const numNFTsValidation = (params) => {
  const { value } = params.props;
  return { ...params.props, error: !value || value < 1 || value > 2 };
};

const INVITATION_COLUMNS = [
  {
    field: "createdAt",
    headerName: "Created At",
    type: "dateTime",
    width: 140,
    valueFormatter: (params) =>
      format(new Date(params.value), "dd/MM/yy hh:mm"),
  },
  {
    field: "invitedBy",
    headerName: "Invited By",
    width: 150,
    renderCell: (params) => <TwitterLink handle={params.row.invitedBy} />,
  },
  {
    field: "twitter",
    headerName: "Twitter",
    width: 150,
    editable: true,
    renderCell: (params) => <TwitterLink handle={params.row.twitter} />,
  },
  {
    field: "address",
    headerName: "ETH Account",
    width: 180,
    preProcessEditCellProps: (params) => {
      const isValid =
        _.isEmpty(params.props.value) ||
        ethersUtils.isAddress(params.props.value);
      return { ...params.props, error: !isValid };
    },
    renderCell: (params) => (
      <>
        <OpenseaLink address={params.row.address}>Opensea</OpenseaLink>
        <EtherscanLink address={params.row.address}>Etherscan</EtherscanLink>
      </>
    ),
  },
  {
    field: "location",
    headerName: "Location",
    width: 180,
    renderCell: renderCellWithTooltip,
  },
  {
    field: "numNFTs",
    headerName: "# NFTs",
    type: "number",
    width: 70,
    valueGetter: ({ value }) => value,
    preProcessEditCellProps: numNFTsValidation,
  },
  {
    field: "note",
    headerName: "Notes",
    minWidth: 300,
    flex: 2,
    editable: true,
    multiline: true,
    renderCell: renderCellWithTooltip,
    renderEditCell: (params) => <MultilineTextEdit {...params} />,
  },
  {
    field: "status",
    headerName: "Status",
    type: "singleSelect",
    valueOptions: Object.values(COLLECTOR_STATUS),
    width: 100,
    editable: true,
    hideIfApproved: true,
  },
  {
    field: "statusInfo",
    headerName: "Status Info",
    minWidth: 300,
    editable: true,
    multiline: true,
    renderCell: renderCellWithTooltip,
    renderEditCell: (params) => <MultilineTextEdit {...params} />,
  },
  {
    field: "buyProbability",
    headerName: "Buy Probability",
    type: "singleSelect",
    valueOptions: [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
      { value: 3, label: "3" },
      { value: 4, label: "4" },
      { value: 5, label: "5" },
    ],
    width: 80,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    editable: true,
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
  // {
  //   field: "invitations",
  //   headerName: "Invitations",
  //   width: 200,
  //   preProcessEditCellProps: (params) => {
  //     return { ...params.props, value: params.props.value.join(",") };
  //   },
  //   hideIfPending: true,
  // },
];

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

  const renderActions = ({ id }) => [
    <ApproveButton
      collectorId={id}
      onSuccess={() =>
        setLocalCollector(id, {
          approved: true,
          status: COLLECTOR_STATUS.Approved,
        })
      }
    />,
  ];

  return (
    <div className={classNames("tab-content invitations")}>
      <h1>{approved ? "Approved" : "Pending"} Collectors</h1>
      <div className="legends">
        <div className="legend inreview">InReview</div>
        <div className="legend toapprove">ToApprove</div>
        <div className="legend good">Good</div>
        <div className="legend maybe">Maybe</div>
        <div className="legend rejected">Rejected</div>
      </div>
      <CRUDTable
        CRUD={CRUD}
        columns={columns}
        rows={collectors}
        setRows={setCollectors}
        itemName="Collector"
        newCreatedOnServer
        renderActions={approved ? null : renderActions}
        loadActionKey="load-collectors"
        omitUpdateFields={["invitedBy"]}
        actionsFirst
        getRowClassName={({ row }) => row.status.toLowerCase()}
      />
    </div>
  );
};

export default InvitationsTab;
