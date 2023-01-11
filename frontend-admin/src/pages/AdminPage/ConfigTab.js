import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import ActionButton from "components/ActionButton";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import {
  loadConfig,
  loadSystemPaused,
  systemSelector,
  updateStageTime,
  toggleIsMintOpen,
} from "store/systemReducer";
import classNames from "classnames";
import { pauseApi, unpauseApi } from "api/contractApi";
import useDDContract from "hooks/useDDContract";
import { isNoContractMode } from "utils";
import add from "date-fns/add";

const ContractConfig = () => {
  const dispatch = useDispatch();
  const contract = useDDContract();
  const { paused } = useSelector(systemSelector);

  const togglePause = async () => {
    await (paused ? unpauseApi(contract) : pauseApi(contract));
    dispatch(loadSystemPaused(contract));
  };

  return (
    <>
      <div className="separator" />
      <div className="title">IS PAUSED</div>
      <div className="center-aligned-row input-row">
        <div className="stage">{paused.toString()}</div>
        <ActionButton actionKey="togglePause" onClick={togglePause}>
          {paused ? "UNPAUSE" : "PAUSE"}
        </ActionButton>
      </div>
    </>
  );
};

const ConfigTab = () => {
  const dispatch = useDispatch();
  const { config } = useSelector(systemSelector);
  const { stageTime } = config;
  const [displayStageTime, setDisplayStageTime] = useState(null);

  useEffect(() => {
    dispatch(loadConfig());
  }, []);

  const time = displayStageTime || stageTime;

  const wasChanged = time && time !== stageTime;

  const toggleMint = async () => {
    const timestamp = config.mintOpen ? null : add(new Date(), { weeks: 1 });
    dispatch(toggleIsMintOpen(timestamp));
  };

  return (
    <div className={classNames("tab-content config")}>
      <h1>Configuration</h1>
      <div className="stage-time">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="center-aligned-row input-row">
            <div className="caption">Stage Time</div>
            <div className="center-aligned-row">
              <DateTimePicker
                minDateTime={new Date()}
                value={time}
                onChange={setDisplayStageTime}
                renderInput={(params) => <TextField {...params} />}
              />
              <div className="countdown">
                {time ? <Countdown date={time} /> : <span>00:00:00:00</span>}
              </div>
            </div>
          </div>
        </LocalizationProvider>
        <div className="button-row">
          <ActionButton
            actionKey={`Save Stage Time`}
            className="save-button"
            onClick={() => dispatch(updateStageTime(displayStageTime))}
            disabled={!wasChanged}
          >
            SAVE
          </ActionButton>
        </div>
      </div>
      <div className="separator" />
      <div className="title">IS MINT OPEN</div>
      <div className="center-aligned-row input-row">
        <div className="stage">{config.mintOpen?.toString()}</div>
        <ActionButton actionKey="toggleIsMintOpen" onClick={toggleMint}>
          {config.mintOpen ? "CLOSE MINT" : "OPEN MINT"}
        </ActionButton>
      </div>
      {!isNoContractMode() && <ContractConfig />}
    </div>
  );
};

export default ConfigTab;
