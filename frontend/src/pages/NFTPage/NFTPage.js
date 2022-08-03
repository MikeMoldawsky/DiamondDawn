import React, { useEffect } from "react";
import classNames from "classnames";
import "./NFTPage.scss";
import { useParams } from "react-router-dom";
import DiamondInfo from "components/DiamondInfo";
import { useSelector } from "react-redux";
import { tokenByIdSelector } from "store/tokensReducer";
import { NavLink } from "react-router-dom";
import { getTokenNextStageName, isTokenActionable } from "utils";
import { uiSelector } from "store/uiReducer";
import useSelectTokenFromRoute from "hooks/useSelectTokenFromRoute";
import { systemSelector } from "store/systemReducer";
import { STAGE } from "consts";

function NFTPage() {
  const { tokenId: tokenIdString } = useParams();
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));
  const { stage } = useSelector(systemSelector);

  useSelectTokenFromRoute();

  const isActionable =
    stage !== STAGE.REBIRTH && isTokenActionable(token, stage);
  const stageName = getTokenNextStageName(token);

  return token ? (
    <div className={classNames("page nft-page")}>
      <div className="info-container">
        <DiamondInfo diamond={token} />
      </div>
      {isActionable && (
        <div className="center-center-aligned-row actionable">
          <div>Your NFT can be processed</div>
          <NavLink to={`/process/${tokenIdString}`}>
            <div className="button">{stageName}</div>
          </NavLink>
        </div>
      )}
    </div>
  ) : null;
}

export default NFTPage;
