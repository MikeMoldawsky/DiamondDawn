import React from "react";
import Countdown from "components/Countdown";
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector, watchTokenProcessed } from "store/tokensReducer";
import { systemSelector } from "store/systemReducer";
import { DUMMY_VIDEO_URL, NFT_TYPE, STAGE } from "consts";
import NoDiamondView from "components/NoDiamondView";
import Diamond from "components/Diamond";
import _ from "lodash";
import ActionButton from "components/ActionButton";
import { isTokenOfType } from "utils";
import ActionView from "components/ActionView";
import useMountLogger from "hooks/useMountLogger";

const Cut = () => {
  const contract = useDDContract();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));
  const { stageStartTimes } = useSelector(systemSelector);

  useMountLogger("Cut");

  const endTime = _.get(stageStartTimes, 2);

  const CutContent = ({ execute }) =>
    isTokenOfType(token, NFT_TYPE.Rough) ? (
      <>
        <Diamond diamond={token} />
        <div className="leading-text">
          EVERYBODY WANT TO BE A DIAMOND,
          <br />
          BUT VERY FEW ARE WILLING TO CUT
        </div>
        <div className="secondary-text">Will you take the risk?</div>
        <div className="action">
          <ActionButton
            actionKey="Cut"
            className="action-button"
            onClick={execute}
          >
            CUT
          </ActionButton>
        </div>
        <Countdown date={endTime} text={["You have", "to cut"]} />
      </>
    ) : (
      <NoDiamondView stageName="cut" />
    );

  return (
    <ActionView
      transact={() => contract.cut(selectedTokenId)}
      watch={watchTokenProcessed(selectedTokenId, STAGE.CUT)}
      videoUrl={DUMMY_VIDEO_URL}
    >
      <CutContent />
    </ActionView>
  );
};

export default Cut;
