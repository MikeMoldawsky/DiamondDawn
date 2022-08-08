import React, { useRef, useState } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import "./DiamondList.scss";
import { systemSelector } from "store/systemReducer";
import { tokensSelector } from "store/tokensReducer";
import useOnClickOutside from "hooks/useClickOutside";
import { getDiamondIcon, isTokenActionable } from "utils";
import { NavLink, useLocation } from "react-router-dom";
import Diamond from "components/Diamond";

const DiamondItem = ({ diamond }) => {
  const { selectedTokenId } = useSelector(uiSelector);
  const { systemStage } = useSelector(systemSelector);
  const [showInfo, setShowInfo] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  useOnClickOutside(ref, () => setShowInfo(false));

  const { id } = diamond;
  const selected = selectedTokenId === id;
  const enabled = isTokenActionable(diamond, systemStage);
  const isLinkToNftPage = !location.pathname.startsWith("/nft");

  return (
    <NavLink to={`/nft/${id}`}>
      <div
        ref={ref}
        className={classNames("diamond-item", { selected, enabled })}
        onMouseEnter={() => isLinkToNftPage && setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <div className="token-icon">
          <FontAwesomeIcon icon={getDiamondIcon(diamond)} />
          <div className="token-id">#{id}</div>
        </div>
        {showInfo && (
          <div className="diamond-info-container">
            <Diamond diamond={diamond} />
          </div>
        )}
      </div>
    </NavLink>
  );
};

const DiamondList = () => {
  const accountTokens = useSelector(tokensSelector);
  return (
    <div className="diamond-list">
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
