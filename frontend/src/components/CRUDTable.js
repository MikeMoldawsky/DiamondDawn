import React, { useState, useEffect } from "react";
import _ from 'lodash'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DataGrid, GridRowModes, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

const CRUDTable = ({ CRUD, columns, itemName, getNewItem, newCreatedOnServer, renderButtons, renderActions }) => {
  const [rows, setRows] = useState([])
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    if (CRUD.read) {
      const fetch = async () => {
        const rows = await CRUD.read()
        setRows(rows)
      }
      fetch()
    }
  }, [])

  const _columns = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      cellClassName: 'actions',
      getActions: (row) => {
        const { id } = row
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
          ...(renderActions ? renderActions(row) : []),
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

  const onAddClick = async () => {
    const newItem = await getNewItem()
    const _id = newItem._id || rows.length
    setRows([...rows, { _id, isNew: !newCreatedOnServer, ...newItem }])
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.Edit, fieldToFocus: columns[0].field },
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
    await CRUD.delete(id)
    setRows(rows.filter((row) => row._id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    let _newRow = await (newRow.isNew
      ? CRUD.create(_.omit(newRow, ['_id', 'isNew']))
      : CRUD.update(newRow))

    setRows(rows.map((row) => (row._id === newRow._id ? _newRow : row)));

    return _newRow;
  };

  return (
    <>
      <div className="table-container">
        <DataGrid rows={rows}
                  columns={_columns}
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
          <FontAwesomeIcon icon={faPlus} /> Add {itemName}
        </div>
        {renderButtons && renderButtons()}
      </div>
    </>
  );
};

export default CRUDTable;
