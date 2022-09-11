import React, { useEffect, useState } from "react";
import "./DiamondPicker.scss";
import { Carousel } from "react-responsive-carousel";
import Diamond from "components/Diamond";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import _ from "lodash";
import { getActionableTokens } from "utils";
import { tokensSelector } from "store/tokensReducer";
import { systemSelector } from "store/systemReducer";
import useMountLogger from "hooks/useMountLogger";
import { isActionPendingSelector } from "components/ActionButton";
import useTimeout from "hooks/useTimeout";

const DiamondPicker = ({ actionKey, disabled }) => {
  const dispatch = useDispatch();
  const { selectedTokenId } = useSelector(uiSelector);
  const [actionableTokens, setActionableTokens] = useState([]);
  const tokens = useSelector(tokensSelector);
  const { systemStage, isStageActive } = useSelector(systemSelector);
  const isActionPending = useSelector(isActionPendingSelector(actionKey));
  const canSelect = !disabled && !isActionPending;
  const [transitionTime, setTransitionTime] = useState(0);

  useMountLogger("DiamondPicker");

  useEffect(() => {
    setActionableTokens(
      getActionableTokens(tokens, systemStage, isStageActive)
    );
  }, []);

  useTimeout(() => {
    setTransitionTime(150);
  }, 1000);

  const selectedIndex = _.findIndex(
    actionableTokens,
    (token) => token.id === selectedTokenId
  );

  const onChange = (index) => {
    if (!canSelect) return;

    dispatch(setSelectedTokenId(_.get(actionableTokens, index)?.id));
  };

  return (
    <Carousel
      selectedItem={selectedIndex}
      onChange={onChange}
      showStatus={false}
      showThumbs={false}
      showIndicators={_.size(actionableTokens) > 1 && canSelect}
      showArrows={canSelect}
      transitionTime={transitionTime}
    >
      {actionableTokens.map((diamond) => (
        <div key={`diamond-picker-${diamond.id}`}>
          <div className="token-id">{diamond.name}</div>
          <Diamond diamond={diamond} />
        </div>
      ))}
    </Carousel>
  );
};

export default DiamondPicker;
