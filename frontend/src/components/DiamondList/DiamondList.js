import React, { useRef, useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import "./DiamondList.scss";
import { systemSelector } from "store/systemReducer";
import { tokensSelector } from "store/tokensReducer";
import useOnClickOutside from "hooks/useClickOutside";
import { getDiamondIcon, isTokenActionable } from "utils";
import { useNavigate } from "react-router-dom";
import Diamond from "components/Diamond";

const DiamondItem = ({ diamond }) => {
  const { selectedTokenId } = useSelector(uiSelector);
  const { systemStage, isActive } = useSelector(systemSelector);
  const [showInfo, setShowInfo] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useOnClickOutside(ref, () => setShowInfo(false));

  const { id } = diamond;
  const selected = selectedTokenId === id;
  const enabled = isTokenActionable(diamond, systemStage, isActive);

  const onClick = () => {
    dispatch(setSelectedTokenId(diamond.id));
    navigate("/collector");
  };

  return (
    <div
      ref={ref}
      className={classNames("diamond-item", { selected, enabled })}
      onClick={onClick}
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <div className="center-aligned-row token-icon">
        <FontAwesomeIcon icon={getDiamondIcon(diamond)} />
        <div className="token-id">#{id}</div>
      </div>
      {showInfo && (
        <div className="diamond-info-container">
          <Diamond diamond={diamond} />
          <div className="token-id">{diamond.name}</div>
        </div>
      )}
    </div>
  );
};

const DiamondList = () => {
  const accountTokens = useSelector(tokensSelector);
  const hasDiamonds = _.size(accountTokens) > 0;
  return (
    <div className="diamond-list">
      {hasDiamonds && <div className="vertical-sep" />}
      {_.map(accountTokens, (diamond) => (
        <DiamondItem
          key={`diamond-list-item-${diamond.id}`}
          diamond={diamond}
        />
      ))}
    </div>
  );
};

export default DiamondList;
