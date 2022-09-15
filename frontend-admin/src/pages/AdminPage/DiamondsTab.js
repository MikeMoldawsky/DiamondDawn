import React, { useEffect, useState } from "react";
import _ from "lodash";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import CRUDTable from "components/CRUDTable";
import { CONTRACTS } from "consts";
import useDDContract from "hooks/useDDContract";
import { eruptionApi } from "api/contractApi";
import {
  getDiamondsApi,
  addDiamondApi,
  updateDiamondApi,
  deleteDiamondApi,
} from "api/serverApi";
import {
  ENUM_TO_CLARITY,
  ENUM_TO_COLOR,
  ENUM_TO_FLUORESCENCE,
  ENUM_TO_GRADE,
  ENUM_TO_SHAPE,
} from "../../utils/diamondConverterApi";

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
    width: 110,
    editable: true,
    preProcessEditCellProps: (params) => {
      const regex = new RegExp("^\\d{10}$");
      return { ...params.props, error: !regex.test(params.props.value) };
    },
  },
  {
    field: "number",
    headerName: "GIA #",
    width: 110,
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
    valueOptions: Object.keys(ENUM_TO_SHAPE),
    width: 75,
    editable: true,
    valueFormatter: (params) => ENUM_TO_SHAPE[params.value],
  },
  {
    field: "length",
    headerName: "Length",
    type: "number",
    width: 60,
    editable: true,
    valueGetter: ({ value }) => value,
    preProcessEditCellProps: measurmentsValidation,
  },
  {
    field: "width",
    headerName: "Width",
    type: "number",
    width: 60,
    editable: true,
    valueGetter: ({ value }) => value,
    preProcessEditCellProps: measurmentsValidation,
  },
  {
    field: "depth",
    headerName: "Depth",
    type: "number",
    width: 60,
    editable: true,
    valueGetter: ({ value }) => value,
    preProcessEditCellProps: measurmentsValidation,
  },
  {
    field: "points",
    headerName: "Points",
    type: "number",
    width: 60,
    editable: true,
    valueGetter: ({ value }) => value,
    preProcessEditCellProps: pointsValidation,
  },
  {
    field: "color",
    headerName: "Color",
    type: "singleSelect",
    valueOptions: Object.keys(ENUM_TO_COLOR),
    width: 70,
    editable: true,
    valueFormatter: (params) => ENUM_TO_COLOR[params.value],
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "clarity",
    headerName: "Clarity",
    type: "singleSelect",
    valueOptions: Object.keys(ENUM_TO_CLARITY),
    width: 80,
    editable: true,
    valueFormatter: (params) => ENUM_TO_CLARITY[params.value],
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "cut",
    headerName: "Cut",
    type: "singleSelect",
    valueOptions: Object.keys(ENUM_TO_GRADE),
    width: 100,
    editable: true,
    valueFormatter: (params) => ENUM_TO_GRADE[params.value],
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "polish",
    headerName: "Polish",
    type: "singleSelect",
    valueOptions: Object.keys(ENUM_TO_GRADE),
    width: 100,
    editable: true,
    valueFormatter: (params) => ENUM_TO_GRADE[params.value],
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "symmetry",
    headerName: "Symmetry",
    type: "singleSelect",
    valueOptions: Object.keys(ENUM_TO_GRADE),
    width: 100,
    editable: true,
    valueFormatter: (params) => ENUM_TO_GRADE[params.value],
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "fluorescence",
    headerName: "Fluorescence",
    type: "singleSelect",
    valueOptions: Object.keys(ENUM_TO_FLUORESCENCE),
    width: 105,
    editable: true,
    valueFormatter: (params) => ENUM_TO_FLUORESCENCE[params.value],
    preProcessEditCellProps: requiredValidation,
  },
  { field: "", headerName: "", flex: 1 },
];

const DiamondsTab = () => {
  const [diamonds, setDiamonds] = useState([]);
  const ddMineContract = useDDContract(CONTRACTS.DiamondDawnMine);

  useEffect(() => {
    const fetch = async () => {
      setDiamonds(await getDiamondsApi());
    };
    fetch();
  }, []);

  const CRUD = {
    create: addDiamondApi,
    update: updateDiamondApi,
    delete: deleteDiamondApi,
  };

  const renderDeployButton = (selectedRows) => (
    <div
      className="button link save-button"
      onClick={() => eruptionApi(ddMineContract, selectedRows)}
    >
      <FontAwesomeIcon icon={faUpload} /> Deploy
    </div>
  );

  return (
    <div className={classNames("tab-content diamonds")}>
      <h1>Diamonds</h1>
      <CRUDTable
        CRUD={CRUD}
        columns={DIAMOND_COLUMNS}
        rows={diamonds}
        setRows={setDiamonds}
        itemName="Diamond"
        getNewItem={getEmptyDiamond}
        renderButtons={renderDeployButton}
        checkboxSelection
      />
    </div>
  );
};

export default DiamondsTab;
