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

const DiamondPicker = () => {
  const dispatch = useDispatch();
  const { selectedTokenId } = useSelector(uiSelector);
  const [actionableTokens, setActionableTokens] = useState([]);
  const tokens = useSelector(tokensSelector);
  const { systemStage, isStageActive } = useSelector(systemSelector);

  console.log("DiamondPicker", { actionableTokens });

  useMountLogger("DiamondPicker");

  useEffect(() => {
    setActionableTokens(
      getActionableTokens(tokens, systemStage, isStageActive)
    );
  }, []);

  const selectedIndex = _.findIndex(
    actionableTokens,
    (token) => token.id === selectedTokenId
  );

  const onChange = (index) =>
    dispatch(setSelectedTokenId(_.get(actionableTokens, index)?.id));

  return (
    <Carousel
      selectedItem={selectedIndex}
      onChange={onChange}
      showStatus={false}
      showThumbs={false}
      showIndicators={_.size(actionableTokens) > 1}
    >
      {actionableTokens.map((diamond) => (
        <div key={`diamond-picker-${diamond.id}`} >
          <div className="token-id">{diamond.name}</div>
          <Diamond diamond={diamond} />
        </div>
      ))}
    </Carousel>
  );
};

export default DiamondPicker;
