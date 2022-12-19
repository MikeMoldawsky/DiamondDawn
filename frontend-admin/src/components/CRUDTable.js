import React, { useState } from "react";
import _ from "lodash";
import {
  DataGrid,
  GridRowModes,
  GridActionsCellItem,
  GridToolbar,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { isActionPendingSelector } from "store/actionStatusReducer";
import BeatLoader from "react-spinners/BeatLoader";

const CRUDTable = ({
  CRUD = {},
  rows,
  setRows,
  columns,
  itemName,
  getNewItem,
  newCreatedOnServer,
  renderButtons,
  renderActions,
  readonly,
  getRowId = (row) => row._id,
  getIsRowDeletable,
  disableSelectionOnClick,
  loadActionKey,
  ...gridProps
}) => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const isLoading = useSelector(isActionPendingSelector(loadActionKey || ""));

  const additionalColumns = [];
  if (!readonly) {
    additionalColumns.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",
      getActions: (params) => {
        const { id } = params;
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
          ...(renderActions ? renderActions(params) : []),
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          ...(_.isFunction(CRUD.delete) &&
          (!getIsRowDeletable || getIsRowDeletable(params.row))
            ? [
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
                />,
              ]
            : []),
        ];
      },
    });
  }
  const _columns = [...columns, ...additionalColumns];

  const onAddClick = async () => {
    const newItem = await getNewItem();
    const _id = newItem._id || rows.length;
    setRows([...rows, { _id, isNew: !newCreatedOnServer, ...newItem }]);
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.Edit, fieldToFocus: columns[0].field },
    });
  };

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
    if (window.confirm(`Are you sure you want to update ${itemName}?`)) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }
  };

  const handleDeleteClick = (id) => async () => {
    if (
      _.isFunction(CRUD.delete) &&
      window.confirm(`Are you sure you want to delete ${itemName}?`)
    ) {
      await CRUD.delete(id);
      setRows(rows.filter((row) => row._id !== id));
    }
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
    if (!_.isFunction(CRUD.update)) return;

    let _newRow = await (newRow.isNew
      ? CRUD.create(_.omit(newRow, ["_id", "isNew"]))
      : CRUD.update(newRow));

    if (_newRow) {
      setRows(rows.map((row) => (row._id === newRow._id ? _newRow : row)));
    }

    return _newRow;
  };

  const renderCustomButtons = () => {
    if (!renderButtons) return null;

    const selectedRows = rows.filter((row) => {
      return selectionModel.includes(getRowId(row));
    });
    return renderButtons(selectedRows, () => setSelectionModel([]));
  };

  return (
    <>
      <div className="table-container">
        {isLoading ? (
          <div className="center-aligned-column table-loading">
            <div>Loading {itemName}s</div>
            <div className="loader">
              <BeatLoader color={"#000"} loading={true} size={20} />
            </div>
          </div>
        ) : (
          <DataGrid
            rows={rows}
            columns={_columns}
            autoHeight
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            keepNonExistentRowsSelected
            disableSelectionOnClick={disableSelectionOnClick}
            editMode="row"
            experimentalFeatures={{ newEditingApi: true }}
            disableColumnMenu
            getRowId={getRowId}
            rowModesModel={rowModesModel}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            checkboxSelection
            {...gridProps}
          />
        )}
      </div>
      <div className="center-aligned-row">
        <div />
        {renderCustomButtons()}
      </div>
    </>
  );
};

export default CRUDTable;
