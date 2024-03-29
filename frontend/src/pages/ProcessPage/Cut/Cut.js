import React, { useCallback } from "react";
import Countdown from "components/Countdown";
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import ActionButton from "components/ActionButton";
import ActionView from "components/ActionView";
import { cutApi } from "api/contractApi";
import DiamondPicker from "components/DiamondPicker";
import { getCDNVideoUrl } from "utils";

const Cut = () => {
  const contract = useDDContract();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));

  const CutContent = useCallback(
    ({ execute, endTime }) => (
      <>
        <DiamondPicker actionKey="Cut" />
        <div className="leading-text">
          EVERYBODY WANT TO BE A DIAMOND,
          <br />
          BUT VERY FEW ARE WILLING TO CUT
        </div>
        <div className="tagline-text">Will you take the risk?</div>
        <div className="action">
          <ActionButton
            actionKey="Cut"
            className="action-button"
            onClick={execute}
          >
            CUT
          </ActionButton>
        </div>
        <Countdown date={endTime} />
      </>
    ),
    [token?.stage]
  );

  return (
    <ActionView
      transact={() => cutApi(contract, selectedTokenId)}
      videoUrl={getCDNVideoUrl("post_cut.mp4")}
      requireActionable
    >
      <CutContent />
    </ActionView>
  );
};

export default Cut;
