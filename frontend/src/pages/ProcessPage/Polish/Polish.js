import React, { useCallback } from "react";
import Countdown from "components/Countdown";
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import ActionButton from "components/ActionButton";
import ActionView from "components/ActionView";
import { polishApi } from "api/contractApi";
import DiamondPicker from "components/DiamondPicker";
import { getCDNObjectUrl } from "utils";

const Polish = () => {
  const contract = useDDContract();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));

  const PolishContent = useCallback(
    ({ execute, endTime }) => (
      <>
        <DiamondPicker actionKey="Polish" />
        <div className="leading-text">
          A GEM CANNOT BE POLISHED WITHOUT FRICTION,
          <br />
          NOR MAN PERFECTED WITHOUT TRIALS
        </div>
        <div className="secondary-text">
          Discover the beauty, a billion years in the making
        </div>
        <div className="action">
          <ActionButton
            actionKey="Polish"
            className="action-button"
            onClick={execute}
          >
            POLISH
          </ActionButton>
        </div>
        <Countdown date={endTime} text={["You have", "to polish"]} />
      </>
    ),
    [token?.stage]
  );

  return (
    <ActionView
      transact={() => polishApi(contract, selectedTokenId)}
      videoUrl={getCDNObjectUrl("/videos/final.mp4")}
      requireActionable
    >
      <PolishContent />
    </ActionView>
  );
};

export default Polish;
