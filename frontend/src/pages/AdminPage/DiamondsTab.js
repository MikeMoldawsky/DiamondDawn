import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import { getShapeName } from "utils";
import CRUDTable from "components/CRUDTable";
import _ from "lodash";
import { utils as ethersUtils } from "ethers";

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

const COLOR_GRADES = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const CLARITY_GRADES = ['FLAWLESS', 'INTERNALLY FLAWLESS', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3']
const COMMON_GRADES = ['EXCELLENT', 'VERY GOOD', 'GOOD', 'FAIR', 'POOR']

const DiamondsTab = () => {
  const [diamonds, setDiamonds] = useState([])

  useEffect(() => {
    const fetch = async () => {
      setDiamonds(await getAllDiamonds())
    }
    fetch()
  }, [])

  const columns = [
    {
      field: 'GIA', headerName: 'GIANumber', width: 150, editable: true,
      preProcessEditCellProps: (params) => {
        const regex = new RegExp('^\\d{10}$')
        return { ...params.props, error: !regex.test(params.props.value) };
      },
    },
    { field: 'shape', headerName: 'Shape', type: 'singleSelect', valueOptions: [0, 1, 2], width: 150, editable: true, valueFormatter: params => getShapeName(params.value) },
    {
      field: 'measurements', headerName: 'Measurements', width: 250, editable: true,
      preProcessEditCellProps: (params) => {
        const regex = new RegExp('^\\d{1}.\\d{2}-\\d{1}.\\d{2}\\*\\d{1}.\\d{2}$')
        return { ...params.props, error: !regex.test(params.props.value) };
      },
    },
    { field: 'carat', headerName: 'Carat Weight', type: 'number', width: 150, editable: true, valueGetter: ({ value }) => value.$numberDecimal },
    { field: 'colorGrade', headerName: 'Color Grade', type: 'singleSelect', valueOptions: COLOR_GRADES, width: 150, editable: true },
    { field: 'clarityGrade', headerName: 'Clarity Grade', type: 'singleSelect', valueOptions: CLARITY_GRADES, width: 150, editable: true },
    { field: 'cutGrade', headerName: 'Cut Grade', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true },
    { field: 'polishGrade', headerName: 'Polish Grade', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true },
    { field: 'symmetryGrade', headerName: 'Symmetry Grade', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true },
    { field: '', headerName: ' ', flex: 1 },
  ];

  const CRUD = {
    create: addDiamond,
    // read: getAllDiamonds,
    update: updateDiamond,
    delete: deleteDiamond,
  }

  return (
    <div className={classNames("tab-content diamonds")}>
      <h1>Diamonds</h1>
      <CRUDTable CRUD={CRUD}
                 columns={columns}
                 rows={diamonds}
                 setRows={setDiamonds}
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
