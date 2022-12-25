import React, { useCallback } from "react";
import useDDContract from "hooks/useDDContract";
import "./Mine.scss";
import { useSelector } from "react-redux";
import Countdown from "components/Countdown";
import { tokenByIdSelector } from "store/tokensReducer";
import ActionButton from "components/ActionButton";
import ActionView from "components/ActionView";
import { mineApi } from "api/contractApi";
import { uiSelector } from "store/uiReducer";
import DiamondPicker from "components/DiamondPicker";
import { getCDNVideoUrl } from "utils";

const Mine = () => {
  const contract = useDDContract();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));

  const MineContent = useCallback(
    ({ execute, endTime }) => (
      <>
        <DiamondPicker actionKey="Mine" />
        <div className="leading-text">A DIAMONDS JOURNEY HAS MANY PHASES</div>
        <div className="tagline-text">The first one is to believe</div>
        <div className="action">
          <ActionButton
            actionKey="Mine"
            className="action-button"
            onClick={execute}
          >
            MINE
          </ActionButton>
        </div>
        <Countdown date={endTime} />
      </>
    ),
    [token?.stage]
  );

  return (
    <ActionView
      transact={() => mineApi(contract, selectedTokenId)}
      videoUrl={getCDNVideoUrl("post_mine.mp4")}
      requireActionable
    >
      <MineContent />
    </ActionView>
  );
};

export default Mine;
