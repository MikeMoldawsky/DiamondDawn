import React from "react";
import Countdown from "components/Countdown";
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import { DUMMY_VIDEO_URL, NFT_TYPE, SYSTEM_STAGE } from "consts";
import NoDiamondView from "components/NoDiamondView";
import Diamond from "components/Diamond";
import ActionButton from "components/ActionButton";
import { isTokenOfType } from "utils";
import ActionView from "components/ActionView";
import { polishApi } from "api/contractApi";

const Polish = () => {
  const contract = useDDContract();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));

  const PolishContent = ({ execute, endTime }) =>
    isTokenOfType(token, NFT_TYPE.Cut) ? (
      <>
        <Diamond diamond={token} />
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
    ) : (
      <NoDiamondView stageName="polish" />
    );

  return (
    <ActionView
      transact={() => polishApi(contract, selectedTokenId)}
      videoUrl={DUMMY_VIDEO_URL}
    >
      <PolishContent />
    </ActionView>
  );
};

export default Polish;
