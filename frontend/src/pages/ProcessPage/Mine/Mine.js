import React, {useCallback} from "react";
import useDDContract from "hooks/useDDContract";
import "./Mine.scss";
import { useSelector } from "react-redux";
import Countdown from "components/Countdown";
import {tokenByIdSelector} from "store/tokensReducer";
import ActionButton from "components/ActionButton";
import ActionView from "components/ActionView";
import {DIAMOND_DAWN_TYPE, DUMMY_VIDEO_URL, TRAIT} from "consts";
import useMountLogger from "hooks/useMountLogger";
import {mineApi} from "api/contractApi";
import {uiSelector} from "store/uiReducer";
import {getTokenTrait, isTokenOfType} from "utils";
import NoDiamondView from "components/NoDiamondView";
import DiamondPicker from "components/DiamondPicker";

const Mine = () => {
  const contract = useDDContract();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));
  const tokenType = getTokenTrait(token, TRAIT.type);

  useMountLogger("Mine");

  const MineContent = useCallback(({ execute, endTime }) => {
    return isTokenOfType(token, DIAMOND_DAWN_TYPE.ENTER_MINE) ? (
      <>
        <DiamondPicker />
        <div className="leading-text">A DIAMONDS JOURNEY HAS MANY STEPS</div>
        <div className="secondary-text">The first one is to believe</div>
        <div className="action">
          <ActionButton
            actionKey="Mine"
            className="action-button"
            onClick={execute}
          >
            MINE
          </ActionButton>
        </div>
        <Countdown date={endTime} text={["You have", "to mine"]} />
      </>
    ) : (
      <NoDiamondView stageName="mine" />
    )
  }, [tokenType]);

  return (
    <ActionView
      transact={() => mineApi(contract, selectedTokenId)}
      videoUrl={DUMMY_VIDEO_URL}
    >
      <MineContent />
    </ActionView>
  );
};

export default Mine;
