import React, { useRef, useState } from "react";
import map from "lodash/map";
import size from "lodash/size";
import toLower from "lodash/toLower";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import "./DiamondList.scss";
import { systemSelector } from "store/systemReducer";
import { ownedTokensSelector } from "store/tokensReducer";
import useOnClickOutside from "hooks/useClickOutside";
import { getStageName, getTokenTrait, isTokenActionable } from "utils";
import { useNavigate } from "react-router-dom";
import { SYSTEM_STAGE, TRAIT } from "consts";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import DiamondThumbnail from "components/DiamondThumbnail";

const NFTIcon = ({ token }) => {
  const shapeName = getTokenTrait(token, TRAIT.shape);

  switch (token.stage) {
    case SYSTEM_STAGE.KEY:
      return <VpnKeyIcon />;
    default:
      return <FontAwesomeIcon icon={faGem} />;
  }
};

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
      <div
        className={classNames(
          "center-aligned-row token-icon",
          toLower(getStageName(diamond.stage))
        )}
      >
        <NFTIcon token={diamond} />
        <div className="token-id">#{id}</div>
      </div>
      {showInfo && <DiamondThumbnail diamond={diamond} />}
    </div>
  );
};

const DiamondList = () => {
  const accountTokens = useSelector(ownedTokensSelector);
  const hasDiamonds = size(accountTokens) > 0;
  return (
    <div className="diamond-list">
      {hasDiamonds && <div className="vertical-sep" />}
      {map(accountTokens, (diamond) => (
        <DiamondItem
          key={`diamond-list-item-${diamond.id}`}
          diamond={diamond}
        />
      ))}
    </div>
  );
};

export default DiamondList;
