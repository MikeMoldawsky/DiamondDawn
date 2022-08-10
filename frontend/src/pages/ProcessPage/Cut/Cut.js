import React, { useCallback } from "react";
import Countdown from "components/Countdown";
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import { DUMMY_VIDEO_URL, NFT_TYPE, TRAIT } from "consts";
import NoDiamondView from "components/NoDiamondView";
import ActionButton from "components/ActionButton";
import { getTokenTrait, isTokenOfType } from "utils";
import ActionView from "components/ActionView";
import useMountLogger from "hooks/useMountLogger";
import { cutApi } from "api/contractApi";
import DiamondPicker from "components/DiamondPicker";

const Cut = () => {
  const contract = useDDContract();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));
  const tokenType = getTokenTrait(token, TRAIT.type);
  useMountLogger("Cut");

  const CutContent = useCallback(
    ({ execute, endTime }) =>
      isTokenOfType(token, NFT_TYPE.Rough) ? (
        <>
          <DiamondPicker />
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
      ),
    [tokenType]
  );

  return (
    <ActionView
      transact={() => cutApi(contract, selectedTokenId)}
      videoUrl={DUMMY_VIDEO_URL}
    >
      <CutContent />
    </ActionView>
  );
};

export default Cut;
