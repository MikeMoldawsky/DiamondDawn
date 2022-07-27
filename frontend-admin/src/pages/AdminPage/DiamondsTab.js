import React, { useEffect, useState } from "react";
import _ from 'lodash'
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import { getShapeName } from "utils";
import CRUDTable from "components/CRUDTable";
import {COLOR_GRADES, CLARITY_GRADES, COMMON_GRADES, CONTRACTS} from 'consts'
import useDDContract from "hooks/useDDContract";

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

const requiredValidation = (params) => {
  return { ...params.props, error: _.isEmpty(params.props.value) };
}

const greaterThenZeroValidation = (params) => {
  const { value } = params.props
  return { ...params.props, error: !value || value <= 0 };
}

const DiamondsTab = () => {
  const [diamonds, setDiamonds] = useState([])
  const ddMineContract = useDDContract(CONTRACTS.DiamondDawnMine)

  useEffect(() => {
    const fetch = async () => {
      setDiamonds(await getAllDiamonds())
    }
    fetch()
  }, [])

  const populateTokens = async selectedRows => {
    try {
      // const addresses = selectedRows.map(r => r.ethAddress)
      const tempDiamond = {
        GIAReportDate: 1,
        GIAReportId: 1,
        measurements: '5.12-5.14*3.55',
        shape: 'Radiant',
        caratWeight: '0.5',
        colorGrade: 'EXCELLENT',
        clarityGrade: 'EXCELLENT',
        cutGrade: 'EXCELLENT',
        polish: 'EXCELLENT',
        symmetry: 'EXCELLENT',
        fluorescence: 'EXCELLENT',
      }
      const tx = await ddMineContract.populateDiamonds([tempDiamond])
      await tx.wait()
    }
    catch (e) {
      console.error('populateTokens Failed', { e })
    }
  }

  const columns = [
    {
      field: 'GIA', headerName: 'GIANumber', width: 150, editable: true,
      preProcessEditCellProps: (params) => {
        const regex = new RegExp('^\\d{10}$')
        return { ...params.props, error: !regex.test(params.props.value) };
      },
    },
    {
      field: 'shape', headerName: 'Shape', type: 'singleSelect', valueOptions: [0, 1, 2], width: 150, editable: true,
      valueFormatter: params => getShapeName(params.value),
    },
    {
      field: 'measurements', headerName: 'Measurements', width: 250, editable: true,
      preProcessEditCellProps: (params) => {
        const regex = new RegExp('^\\d{1}.\\d{1,2}-\\d{1}.\\d{1,2}\\*\\d{1}.\\d{1,2}$')
        return { ...params.props, error: !regex.test(params.props.value) };
      },
    },
    {
      field: 'carat', headerName: 'Carat Weight', type: 'number', width: 150, editable: true, valueGetter: ({ value }) => value.$numberDecimal,
      preProcessEditCellProps: greaterThenZeroValidation,
    },
    {
      field: 'colorGrade', headerName: 'Color Grade', type: 'singleSelect', valueOptions: COLOR_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'clarityGrade', headerName: 'Clarity Grade', type: 'singleSelect', valueOptions: CLARITY_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'cutGrade', headerName: 'Cut Grade', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'polishGrade', headerName: 'Polish Grade', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'symmetryGrade', headerName: 'Symmetry Grade', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
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
                 getNewItem={() => ({ GIA: '', shape: 0, measurements: '', carat: 0, colorGrade: '', clarityGrade: '', cutGrade: '', polishGrade: '', symmetryGrade: '' })}
                 renderButtons={(selectedRows) => (
                   <div className="button link save-button" onClick={() => populateTokens(selectedRows)}>
                     <FontAwesomeIcon icon={faUpload} /> Deploy
                   </div>
                 )} />
    </div>
  );
};

export default DiamondsTab;
