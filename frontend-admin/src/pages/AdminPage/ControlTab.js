import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStage, fetchPaused, systemSelector } from "store/systemReducer";
import useDDContract from "hooks/useDDContract";
import ActionButton from "components/ActionButton";
import { completeCurrentStageAndRevealNextStage, pause, unpause } from 'api'

const ControlTab = () => {
  const { stage, paused } = useSelector(systemSelector);

  const contract = useDDContract();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStage(contract));
    dispatch(fetchPaused(contract));
  }, [contract, dispatch]);

  const completeAndRevealStage = async () => {
    await completeCurrentStageAndRevealNextStage(contract);
    dispatch(fetchStage(contract));
  };

  const togglePause = async () => {
    await (paused ? unpause() : pause());
    dispatch(fetchPaused(contract));
  };

  return (
    <div className="admin-control">
      <h1>Control Panel</h1>
      <div className="center-aligned-row input-row">
        <div className="stage">STAGE: {stage}</div>
        <ActionButton
          actionKey="Complete and Reveal Stage"
          onClick={completeAndRevealStage}>
          Next Stage
        </ActionButton>
      </div>
      <div className="center-aligned-row input-row">
        <div className="stage">PAUSED: {paused.toString()}</div>
        <ActionButton actionKey="togglePause" onClick={togglePause}>
          {paused ? 'Unpause' : 'Pause'}
        </ActionButton>
      </div>
    </div>
  );
};

export default ControlTab;
