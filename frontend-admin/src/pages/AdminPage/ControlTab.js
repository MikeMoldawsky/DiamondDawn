import React, {useEffect, useState} from "react";
import map from 'lodash/map'
import { useDispatch, useSelector } from "react-redux";
import {
  loadSystemStage,
  loadSystemPaused,
  systemSelector,
} from "store/systemReducer";
import useDDContract from "hooks/useDDContract";
import ActionButton from "components/ActionButton";
import { setSystemStageApi, pauseApi, unpauseApi } from "api/contractApi";
import { getSystemStageName } from "utils";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {SYSTEM_STAGE} from "consts";

const ControlTab = () => {
  const { systemStage, paused } = useSelector(systemSelector);
  const [inputStage, setInputStage] = useState(-1)

  const contract = useDDContract();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSystemStage(contract));
    dispatch(loadSystemPaused(contract));
  }, [contract, dispatch]);

  const setSystemStage = async (systemStage) => {
    await setSystemStageApi(contract, systemStage);
    dispatch(loadSystemStage(contract));
  };

  const togglePause = async () => {
    await (paused ? unpauseApi(contract) : pauseApi(contract));
    dispatch(loadSystemPaused(contract));
  };

  const onStageInputChange = e => setInputStage(e.target.value)

  return (
    <div className="admin-control">
      <h1>Control Panel</h1>
      <div className="caption">SYSTEM STAGE</div>
      <div className="center-aligned-row input-row">
        <div className="stage">{getSystemStageName(systemStage)}</div>
        <ActionButton
          actionKey="Complete and Reveal Stage"
          disabled={systemStage === SYSTEM_STAGE.COMPLETE}
          onClick={() => setSystemStage(systemStage + 1)}
        >
          NEXT STAGE
        </ActionButton>
      </div>
      <div className="center-aligned-row input-row">
        <div className="stage">
          <Select value={inputStage} onChange={onStageInputChange}>
            <MenuItem value={-1}>NOT SELECTED</MenuItem>
            {map(SYSTEM_STAGE, stage => (
              <MenuItem key={`stage-select-item-${stage}`} value={stage}>{getSystemStageName(stage)}</MenuItem>
            ))}
          </Select>
        </div>
        <ActionButton
          actionKey="Set Stage"
          onClick={() => setSystemStage(inputStage)}
        >
          SET STAGE
        </ActionButton>
      </div>
      <div className="separator" />
      <div className="caption">PAUSED</div>
      <div className="center-aligned-row input-row">
        <div className="stage">{paused.toString()}</div>
        <ActionButton actionKey="togglePause" onClick={togglePause}>
          {paused ? "UNPAUSE" : "PAUSE"}
        </ActionButton>
      </div>
    </div>
  );
};

export default ControlTab;
