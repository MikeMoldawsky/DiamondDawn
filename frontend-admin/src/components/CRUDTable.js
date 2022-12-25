import React, { useState } from "react";
import _ from "lodash";
import {
  DataGrid,
  GridRowModes,
  GridToolbar,
} from "@mui/x-data-grid";
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
  omitUpdateFields = [],
  ...gridProps
}) => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const isLoading = useSelector(isActionPendingSelector(loadActionKey || ""));

  const additionalColumns = [];
  if (!readonly && renderActions) {
    additionalColumns.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",
      getActions: renderActions,
    });
  }
  const _columns = [...columns, ...additionalColumns];

  const cancelEdit = (id) => () => {
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
      : CRUD.update(_.omit(newRow, omitUpdateFields)));

    if (_newRow) {
      setRows(rows.map((row) => (row._id === newRow._id ? _newRow : row)));
    }

    return _newRow;
  };

  const handleRowEditStart = async (params, event) => {
    event.defaultMuiPrevented = true;
    setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.Edit } });
  };

  const handleRowEditStop = async (params, event) => {
    const { id, reason, field, columns } = params
    if (reason === "escapeKeyDown") {
      cancelEdit(id)()
      return
    }
    if (reason === "enterKeyDown") {
      const col = _.find(columns, { field })
      if (!event.ctrlKey && col?.multiline) return
    }
    event.defaultMuiPrevented = true;
    if (window.confirm(`Are you sure you want to update ${itemName}?`)) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }
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
            getRowHeight={() => 'auto'}
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
