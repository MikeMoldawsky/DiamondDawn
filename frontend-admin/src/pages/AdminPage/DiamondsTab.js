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
      const diamonds = selectedRows.map(diamond => ({
        ..._.omit(diamond, ['_id']),
        carat: diamond.carat.$numberDecimal,
        clarity: diamond.clarity,
        color: diamond.color,
        cut: diamond.cut,
        depth: diamond.depth.$numberDecimal,
        fluorescence: diamond.fluorescence,
        length: diamond.length.$numberDecimal,
        polish: diamond.polish,
        reportDate: parseInt(diamond.reportDate),
        reportNumber: parseInt(diamond.reportNumber),
        shape: diamond.shape,
        symmetry: diamond.symmetry,
        width: diamond.width.$numberDecimal
      }))

      console.log('PUSHING DIAMONDS TO MINE CONTRACT', { diamonds })

      const tx = await ddMineContract.populateDiamonds(diamonds)
      await tx.wait()
    }
    catch (e) {
      console.error('populateTokens Failed', { e })
    }
  }

  const columns = [
    {
      field: 'reportNumber', headerName: 'GIA #', width: 150, editable: true,
      preProcessEditCellProps: (params) => {
        const regex = new RegExp('^\\d{10}$')
        return { ...params.props, error: !regex.test(params.props.value) };
      },
    },
    {
      field: 'reportDate', headerName: 'Date', width: 150, editable: true,
      preProcessEditCellProps: (params) => {
        const regex = new RegExp('^\\d{10}$')
        return { ...params.props, error: !regex.test(params.props.value) };
      },
    },
    {
      field: 'shape', headerName: 'Shape', type: 'singleSelect', valueOptions: [2, 3, 4, 5], width: 150, editable: true,
      valueFormatter: params => getShapeName(params.value),
    },
    {
      field: 'carat', headerName: 'Carat', type: 'number', width: 150, editable: true, valueGetter: ({ value }) => value.$numberDecimal,
      preProcessEditCellProps: greaterThenZeroValidation,
    },
    {
      field: 'color', headerName: 'Color', type: 'singleSelect', valueOptions: COLOR_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'clarity', headerName: 'Clarity', type: 'singleSelect', valueOptions: CLARITY_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'cut', headerName: 'Cut', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'polish', headerName: 'Polish', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'symmetry', headerName: 'Symmetry', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'fluorescence', headerName: 'Fluorescence', type: 'singleSelect', valueOptions: COMMON_GRADES, width: 150, editable: true,
      preProcessEditCellProps: requiredValidation,
    },
    {
      field: 'length', headerName: 'Length', type: 'number', width: 150, editable: true, valueGetter: ({ value }) => value.$numberDecimal,
      preProcessEditCellProps: greaterThenZeroValidation,
    },
    {
      field: 'width', headerName: 'Width', type: 'number', width: 150, editable: true, valueGetter: ({ value }) => value.$numberDecimal,
      preProcessEditCellProps: greaterThenZeroValidation,
    },
    {
      field: 'depth', headerName: 'Depth', type: 'number', width: 150, editable: true, valueGetter: ({ value }) => value.$numberDecimal,
      preProcessEditCellProps: greaterThenZeroValidation,
    },
    { field: '', headerName: '', flex: 1 },
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
                 getNewItem={() => ({ reportNumber: '', reportDate: '', shape: 2, carat: 0, color: '', clarity: '', cut: '', polish: '', symmetry: '', fluorescence: '', length: 0, width: 0, depth: 0 })}
                 renderButtons={(selectedRows) => (
                   <div className="button link save-button" onClick={() => populateTokens(selectedRows)}>
                     <FontAwesomeIcon icon={faUpload} /> Deploy
                   </div>
                 )} />
    </div>
  );
};

export default DiamondsTab;
