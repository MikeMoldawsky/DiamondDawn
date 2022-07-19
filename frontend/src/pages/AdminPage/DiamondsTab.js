import React, { useState, useEffect } from "react";
import _ from 'lodash'
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import { DataGrid, GridRowModes, GridActionsCellItem } from '@mui/x-data-grid';
import { shapeName } from "utils";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

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
  const [diamonds, setDiamonds] = useState([])
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const rows = await getAllDiamonds()
      setDiamonds(rows)
    }
    fetch()
  }, [])

  const columns = [
    { field: 'GIA', headerName: 'GIA', width: 200, editable: true },
    { field: 'shape', headerName: 'Shape', type: 'singleSelect', valueOptions: [0, 1, 2], width: 150, editable: true, valueFormatter: params => shapeName(params.value) },
    { field: 'carat', headerName: 'Carat', type: 'number', width: 150, editable: true, valueGetter: ({ value }) => value.$numberDecimal },
    { field: '', headerName: ' ', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const onAddClick = () => {
    const _id = diamonds.length
    setDiamonds([...diamonds, { _id, GIA: '', shape: 0, carat: 0, isNew: true }])
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.Edit, fieldToFocus: 'GIA' },
    });
  }

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    const result = await deleteDiamond(id)
    setDiamonds(diamonds.filter((row) => row._id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = diamonds.find((row) => row._id === id);
    if (editedRow.isNew) {
      setDiamonds(diamonds.filter((row) => row._id !== id));
    }
  };

  const processRowUpdate = async (newRow, oldRow) => {
    let newDiamond = await (newRow.isNew
      ? addDiamond(_.omit(newRow, ['_id', 'isNew']))
      : updateDiamond(newRow))

    setDiamonds(diamonds.map((row) => (row._id === newRow._id ? newDiamond : row)));

    return newDiamond;
  };

  return (
    <div className={classNames("tab-content diamonds")}>
      <h1>Diamonds</h1>
      <div className="table-container">
        <DataGrid rows={diamonds}
                  columns={columns}
                  autoHeight
                  checkboxSelection
                  disableSelectionOnClick
                  editMode="row"
                  experimentalFeatures={{ newEditingApi: true }}
                  disableColumnMenu
                  getRowId={row => row._id}
                  rowModesModel={rowModesModel}
                  onRowEditStart={handleRowEditStart}
                  onRowEditStop={handleRowEditStop}
                  processRowUpdate={processRowUpdate} />
      </div>
      <div className="center-aligned-row">
        <div className="button link add-button" onClick={onAddClick}>
          <FontAwesomeIcon icon={faPlus} /> Add Diamond
        </div>
        <div className="button link save-button">
          <FontAwesomeIcon icon={faUpload} /> Deploy
        </div>
      </div>
    </div>
  );
};

export default DiamondsTab;
