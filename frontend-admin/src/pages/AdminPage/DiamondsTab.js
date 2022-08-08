import React, { useEffect, useState } from "react";
import _ from "lodash";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { getShapeName } from "utils";
import CRUDTable from "components/CRUDTable";
import {
  COLOR_GRADES,
  CLARITY_GRADES,
  COMMON_GRADES,
  CONTRACTS,
  SYSTEM_STAGE,
} from "consts";
import useDDContract from "hooks/useDDContract";
import { populateDiamondsApi } from "api/contractApi";
import {
  getDiamondsApi,
  addDiamondApi,
  updateDiamondApi,
  deleteDiamondApi,
} from "api/serverApi";

const requiredValidation = (params) => {
  return { ...params.props, error: _.isEmpty(params.props.value) };
};

const greaterThenZeroValidation = (params) => {
  const { value } = params.props;
  return { ...params.props, error: !value || value <= 0 };
};

const getEmptyDiamond = () => ({
  reportNumber: "",
  reportDate: "",
  shape: 2,
  carat: 0,
  color: "",
  clarity: "",
  cut: "",
  polish: "",
  symmetry: "",
  fluorescence: "",
  length: 0,
  width: 0,
  depth: 0,
});

const DIAMOND_COLUMNS = [
  {
    field: "reportNumber",
    headerName: "GIA #",
    width: 150,
    editable: true,
    preProcessEditCellProps: (params) => {
      const regex = new RegExp("^\\d{10}$");
      return { ...params.props, error: !regex.test(params.props.value) };
    },
  },
  {
    field: "reportDate",
    headerName: "Date",
    width: 150,
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
    valueOptions: [0, 1, 2, 3],
    width: 150,
    editable: true,
    valueFormatter: (params) =>
      getShapeName(params.value, SYSTEM_STAGE.CUT_OPEN),
  },
  {
    field: "carat",
    headerName: "Carat",
    type: "number",
    width: 150,
    editable: true,
    valueGetter: ({ value }) => value.$numberDecimal,
    preProcessEditCellProps: greaterThenZeroValidation,
  },
  {
    field: "color",
    headerName: "Color",
    type: "singleSelect",
    valueOptions: COLOR_GRADES,
    width: 150,
    editable: true,
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "clarity",
    headerName: "Clarity",
    type: "singleSelect",
    valueOptions: CLARITY_GRADES,
    width: 150,
    editable: true,
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "cut",
    headerName: "Cut",
    type: "singleSelect",
    valueOptions: COMMON_GRADES,
    width: 150,
    editable: true,
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "polish",
    headerName: "Polish",
    type: "singleSelect",
    valueOptions: COMMON_GRADES,
    width: 150,
    editable: true,
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "symmetry",
    headerName: "Symmetry",
    type: "singleSelect",
    valueOptions: COMMON_GRADES,
    width: 150,
    editable: true,
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "fluorescence",
    headerName: "Fluorescence",
    type: "singleSelect",
    valueOptions: COMMON_GRADES,
    width: 150,
    editable: true,
    preProcessEditCellProps: requiredValidation,
  },
  {
    field: "length",
    headerName: "Length",
    type: "number",
    width: 150,
    editable: true,
    valueGetter: ({ value }) => value.$numberDecimal,
    preProcessEditCellProps: greaterThenZeroValidation,
  },
  {
    field: "width",
    headerName: "Width",
    type: "number",
    width: 150,
    editable: true,
    valueGetter: ({ value }) => value.$numberDecimal,
    preProcessEditCellProps: greaterThenZeroValidation,
  },
  {
    field: "depth",
    headerName: "Depth",
    type: "number",
    width: 150,
    editable: true,
    valueGetter: ({ value }) => value.$numberDecimal,
    preProcessEditCellProps: greaterThenZeroValidation,
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
      onClick={() => populateDiamondsApi(ddMineContract, selectedRows)}
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
      />
    </div>
  );
};

export default DiamondsTab;
