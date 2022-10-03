import React, { useEffect, useState } from "react";
import _ from "lodash";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import CRUDTable from "components/CRUDTable";
import {
  SHAPE,
  CLARITY_GRADES,
  COLOR_GRADES,
  COMMON_GRADES,
  CONTRACTS,
  FLUORESCENCE_GRADES,
} from "consts";
import useDDContract from "hooks/useDDContract";
import { eruptionApi } from "api/contractApi";
import { logEruptionTxApi, clearEruptionTxsApi } from "api/serverApi";
import { getEnumKeyByValue, showError, unixTimestampToDateString } from "utils";
import DIAMONDS_INFO from "assets/data/diamonds";
import { useProvider } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import {
  loadConfig,
  loadDiamondCount,
  systemSelector,
} from "store/systemReducer";
import { utils as ethersUtils } from "ethers";
import ActionButton from "components/ActionButton";

const requiredValidation = (params) => {
  return { ...params.props, error: _.isEmpty(params.props.value) };
};

const pointsValidation = (params) => {
  const { value } = params.props;
  return { ...params.props, error: !value || value < 30 || value > 70 };
};

const measurmentsValidation = (params) => {
  const { value } = params.props;
  return { ...params.props, error: !value || value < 100 || value > 600 };
};

const getEmptyDiamond = () => ({
  number: "",
  date: "",
  shape: 0,
  carat: 0,
  color: 0,
  clarity: 0,
  cut: 0,
  polish: 0,
  symmetry: 0,
  fluorescence: 0,
  width: 0,
  length: 0,
  depth: 0,
});

const DIAMOND_COLUMNS = [
  {
    field: "date",
    headerName: "Date",
    width: 160,
    editable: true,
    valueFormatter: (params) => unixTimestampToDateString(params.value),
    preProcessEditCellProps: (params) => {
      const regex = new RegExp("^\\d{10}$");
      return { ...params.props, error: !regex.test(params.props.value) };
    },
  },
  {
    field: "number",
    headerName: "GIA #",
    width: 130,
    editable: true,
    preProcessEditCellProps: (params) => {
      const regex = new RegExp("^\\d{10}$");
      return { ...params.props, error: !regex.test(params.props.value) };
    },
  },
  {
    field: "shape",
    headerName: "Shape",
    type: "singleSelect",
    valueOptions: Object.values(SHAPE),
    width: 80,
    editable: true,
    valueFormatter: (params) => getEnumKeyByValue(SHAPE, params.value),
  },
  {
    field: "length",
    headerName: "Length",
    type: "number",
    width: 70,
    editable: true,
    valueGetter: ({ value }) => value,
    preProcessEditCellProps: measurmentsValidation,
  },
  {
    field: "width",
    headerName: "Width",
    type: "number",
    width: 70,
    editable: true,
    valueGetter: ({ value }) => value,
    preProcessEditCellProps: measurmentsValidation,
  },
  {
    field: "depth",
    headerName: "Depth",
    type: "number",
    width: 70,
    editable: true,
    valueGetter: ({ value }) => value,
    preProcessEditCellProps: measurmentsValidation,
  },
  {
    field: "points",
    headerName: "Points",
    type: "number",
    width: 70,
    editable: true,
    valueGetter: ({ value }) => value,
    preProcessEditCellProps: pointsValidation,
  },
  {
    field: "color",
    headerName: "Color",
    type: "singleSelect",
    valueOptions: Object.values(COLOR_GRADES),
    width: 70,
    editable: true,
    valueFormatter: (params) => getEnumKeyByValue(COLOR_GRADES, params.value),
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "clarity",
    headerName: "Clarity",
    type: "singleSelect",
    valueOptions: Object.values(CLARITY_GRADES),
    width: 80,
    editable: true,
    valueFormatter: (params) => getEnumKeyByValue(CLARITY_GRADES, params.value),
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "cut",
    headerName: "Cut",
    type: "singleSelect",
    valueOptions: Object.values(COMMON_GRADES),
    width: 100,
    editable: true,
    valueFormatter: (params) => getEnumKeyByValue(COMMON_GRADES, params.value),
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "polish",
    headerName: "Polish",
    type: "singleSelect",
    valueOptions: Object.values(COMMON_GRADES),
    width: 100,
    editable: true,
    valueFormatter: (params) => getEnumKeyByValue(COMMON_GRADES, params.value),
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "symmetry",
    headerName: "Symmetry",
    type: "singleSelect",
    valueOptions: Object.values(COMMON_GRADES),
    width: 100,
    editable: true,
    valueFormatter: (params) => getEnumKeyByValue(COMMON_GRADES, params.value),
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "fluorescence",
    headerName: "Fluorescence",
    type: "singleSelect",
    valueOptions: Object.values(FLUORESCENCE_GRADES),
    width: 105,
    editable: true,
    valueFormatter: (params) =>
      getEnumKeyByValue(FLUORESCENCE_GRADES, params.value),
    preProcessEditCellProps: requiredValidation,
  },
];

const DiamondsTab = () => {
  const ddMineContract = useDDContract(CONTRACTS.DiamondDawnMine);
  const { ddMineContractData, config, diamondCount } =
    useSelector(systemSelector);
  const [deployedGIAs, setDeployedGIAs] = useState([]);
  const provider = useProvider();
  const dispatch = useDispatch();

  const readEruptionTx = async (txHash) => {
    try {
      const eruptionTx = await provider.getTransaction(txHash);
      const iface = new ethersUtils.Interface(ddMineContractData.artifact.abi);
      const decodedData = iface.parseTransaction({ data: eruptionTx.data });
      return _.map(decodedData.args.diamonds, (d) => d.number);
    } catch (e) {
      console.error(`readEruptionTx Failed`, { txHash, e });
    }
  };

  const readEruptionTxs = async () => {
    const numbers = await Promise.all(
      _.map(config.eruptionTxs, readEruptionTx)
    );
    setDeployedGIAs(_.flatten(numbers));
  };

  const eruptionTxCount = _.get(config, "eruptionTxs", []).length;

  useEffect(() => {
    if (eruptionTxCount > 0) {
      readEruptionTxs();
    }
  }, [eruptionTxCount]);

  useEffect(() => {
    dispatch(loadDiamondCount(ddMineContract));
    dispatch(loadConfig());
  }, []);

  const populateDiamonds = async (diamonds) => {
    const txHash = await eruptionApi(ddMineContract, diamonds);
    await logEruptionTxApi(txHash);
    dispatch(loadDiamondCount(ddMineContract));
    dispatch(loadConfig());
  };

  const clearEruptionTxs = async () => {
    await clearEruptionTxsApi();
    dispatch(loadConfig());
    setDeployedGIAs([]);
  };

  const renderDeployButton = (selectedRows, clearSelection) => (
    <div
      className="button link save-button"
      onClick={async () => {
        try {
          await populateDiamonds(selectedRows);
          clearSelection();
        } catch (e) {
          showError(e, "Eruption Error");
        }
      }}
    >
      <FontAwesomeIcon icon={faUpload} /> Deploy
    </div>
  );

  const isRowDeployed = (row) => _.includes(deployedGIAs, row.number);

  return (
    <div className={classNames("tab-content diamonds")}>
      <h1>Diamonds</h1>
      {config?.eruptionTxs?.length > 0 && diamondCount === 0 && (
        <div className="center-aligned-row clear-db-message">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          DB contains eruptionTxs but diamondCount on the contract is 0{" "}
          <ActionButton
            actionKey="clear-config-tx-hashes"
            onClick={clearEruptionTxs}
          >
            CLEAR TXS
          </ActionButton>
        </div>
      )}
      <CRUDTable
        columns={DIAMOND_COLUMNS}
        rows={DIAMONDS_INFO}
        itemName="Diamond"
        getNewItem={getEmptyDiamond}
        renderButtons={renderDeployButton}
        checkboxSelection
        getRowId={(row) => row.number}
        readonly
        getRowClassName={(params) =>
          isRowDeployed(params.row) ? "deployed" : ""
        }
        isRowSelectable={(params) => !isRowDeployed(params.row)}
      />
    </div>
  );
};

export default DiamondsTab;
