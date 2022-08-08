import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSystemStage,
  fetchPaused,
  systemSelector,
} from "store/systemReducer";
import useDDContract from "hooks/useDDContract";
import ActionButton from "components/ActionButton";
import { setSystemStageApi, pause, unpause } from "api/contractApi";
import { getSystemStageName } from "utils";
import {SYSTEM_STAGE} from "../../consts";

const ControlTab = () => {
  const { systemStage, paused } = useSelector(systemSelector);

  const contract = useDDContract();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSystemStage(contract));
    dispatch(fetchPaused(contract));
  }, [contract, dispatch]);

  const setSystemStage = async (systemStage) => {
    await setSystemStageApi(contract, systemStage);
    dispatch(fetchSystemStage(contract));
  };

  const togglePause = async () => {
    await (paused ? unpause(contract) : pause(contract));
    dispatch(fetchPaused(contract));
  };

  // TODO: asaf add system Stage param from admin panel
  return (
    <div className="admin-control">
      <h1>Control Panel</h1>
      <div className="caption">SYSTEM STAGE</div>
      <div className="center-aligned-row input-row">
        <div className="stage">{getSystemStageName(systemStage)}</div>
          <ActionButton
          actionKey="Complete and Reveal Stage"
          onClick={() => setSystemStage(SYSTEM_STAGE.MINE_OPEN)}
        >
          Next Stage
        </ActionButton>
      </div>
      <div className="separator" />
      <div className="caption">PAUSED</div>
      <div className="center-aligned-row input-row">
        <div className="stage">{paused.toString()}</div>
        <ActionButton actionKey="togglePause" onClick={togglePause}>
          {paused ? "Unpause" : "Pause"}
        </ActionButton>
      </div>
    </div>
  );
};

export default ControlTab;
