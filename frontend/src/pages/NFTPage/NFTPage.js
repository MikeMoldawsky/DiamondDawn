import React from "react";
import classNames from "classnames";
import "./NFTPage.scss";
import DiamondInfo from "components/DiamondInfo";
import { useSelector } from "react-redux";
import { tokenByIdSelector } from "store/tokensReducer";
import { NavLink } from "react-router-dom";
import { getTokenNextStageName, isTokenActionable, isTokenDone } from "utils";
import { uiSelector } from "store/uiReducer";
import useSelectTokenFromRoute from "hooks/useSelectTokenFromRoute";
import { systemSelector } from "store/systemReducer";

function NFTPage() {
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));
  const { systemStage } = useSelector(systemSelector);

  useSelectTokenFromRoute();

  if (!token) return null;

  const renderByStatusPart = () => {
    if (isTokenDone(token, systemStage))
      return (
        <>
          <div className="leading-text">This is Your Final Diamond NFT</div>
          <div className="info-container">
            <DiamondInfo diamond={token} />
          </div>
        </>
      );
    if (isTokenActionable(token, systemStage)) {
      const actionName = getTokenNextStageName(token);
      return (
        <>
          <div className="info-container">
            <DiamondInfo diamond={token} />
          </div>
          <div className="center-center-aligned-row actionable">
            <div>Your NFT can be processed</div>
            {actionName === "REBIRTH" ? (
              <div className="button disabled">{actionName}</div>
            ) : (
              <NavLink to={`/process`}>
                <div className="button">{actionName}</div>
              </NavLink>
            )}
          </div>
        </>
      );
    }
    return (
      <div className="info-container">
        <DiamondInfo diamond={token} />
      </div>
    );
  };

  return (
    <div className={classNames("page nft-page")}>{renderByStatusPart()}</div>
  );
}

export default NFTPage;
