import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStage, fetchPaused, systemSelector } from "store/systemReducer";
import useDDContract from "hooks/useDDContract";
import ActionButton from "components/ActionButton";
import { nextStage, pause, unpause } from "api/contractApi";
import { getStageName } from "utils";

const ControlTab = () => {
  const { stage, paused } = useSelector(systemSelector);

  const contract = useDDContract();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStage(contract));
    dispatch(fetchPaused(contract));
  }, [contract, dispatch]);

  const completeAndRevealStage = async () => {
    await nextStage(contract);
    dispatch(fetchStage(contract));
  };

  const togglePause = async () => {
    await (paused ? unpause(contract) : pause(contract));
    dispatch(fetchPaused(contract));
  };

  return (
    <div className="admin-control">
      <h1>Control Panel</h1>
      <div className="caption">SYSTEM STAGE</div>
      <div className="center-aligned-row input-row">
        <div className="stage">{getStageName(stage)}</div>
        <ActionButton
          actionKey="Complete and Reveal Stage"
          onClick={completeAndRevealStage}
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
