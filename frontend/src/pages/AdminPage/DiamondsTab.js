import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import { getShapeName } from "utils";
import CRUDTable from "components/CRUDTable";

const getAllDiamonds = async () => {
  try {
    const res = await axios.get(`/api/get_diamonds`)
    return res.data
  } catch (e) {
    return []
  }
}

const addDiamond = async (diamond) => {
  try {
    const { data } = await axios.post(`/api/create_diamond`, diamond)
    return data
  } catch (e) {
    return null
  }
}

const updateDiamond = async (diamond) => {
  try {
    const { data } = await axios.post(`/api/update_diamond`, diamond)
    return data
  } catch (e) {
    return null
  }
}

const deleteDiamond = async (diamondId) => {
  try {
    const { data } = await axios.post(`/api/delete_diamond`, { diamondId })
    return data
  } catch (e) {
    return null
  }
}

const DiamondsTab = () => {

  const columns = [
    { field: 'GIA', headerName: 'GIA', width: 200, editable: true },
    { field: 'shape', headerName: 'Shape', type: 'singleSelect', valueOptions: [0, 1, 2], width: 150, editable: true, valueFormatter: params => getShapeName(params.value) },
    { field: 'carat', headerName: 'Carat', type: 'number', width: 150, editable: true, valueGetter: ({ value }) => value.$numberDecimal },
    { field: '', headerName: ' ', flex: 1 },
  ];

  const CRUD = {
    create: addDiamond,
    read: getAllDiamonds,
    update: updateDiamond,
    delete: deleteDiamond,
  }

  return (
    <div className={classNames("tab-content diamonds")}>
      <h1>Diamonds</h1>
      <CRUDTable CRUD={CRUD}
                 columns={columns}
                 itemName="Diamond"
                 getNewItem={() => ({ GIA: '', shape: 0, carat: 0 })}
                 renderButtons={() => (
                   <div className="button link save-button">
                     <FontAwesomeIcon icon={faUpload} /> Deploy
                   </div>
                 )} />
    </div>
  );
};

export default DiamondsTab;
