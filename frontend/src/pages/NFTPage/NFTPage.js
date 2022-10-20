import React from "react";
import classNames from "classnames";
import "./NFTPage.scss";
import DiamondInfo from "components/DiamondInfo";
import { useSelector } from "react-redux";
import { tokenByIdSelector } from "store/tokensReducer";
import { NavLink, useLocation } from "react-router-dom";
import { getTokenNextStageName, isTokenActionable, isTokenDone } from "utils";
import { uiSelector } from "store/uiReducer";
import useSelectTokenFromRoute from "hooks/useSelectTokenFromRoute";
import { systemSelector } from "store/systemReducer";
import { PageTransition } from "@steveeeie/react-page-transition";

function NFTPage() {
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));
  const { systemStage, isActive } = useSelector(systemSelector);
  const location = useLocation();

  useSelectTokenFromRoute();

  if (!token) return null;

  const renderByStatusPart = () => {
    if (isTokenDone(token, systemStage, isActive))
      return (
        <>
          <div className="leading-text">This is Your Final Diamond NFT</div>
          <div className="info-container">
            <DiamondInfo diamond={token} />
          </div>
        </>
      );
    if (isTokenActionable(token, systemStage, isActive)) {
      const actionName = getTokenNextStageName(token);
      return (
        <>
          <div className="info-container">
            <DiamondInfo diamond={token} />
          </div>
          <div className="center-center-aligned-row actionable">
            <div>Your NFT can be processed</div>
            {actionName === "COMPLETE" ? (
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
    <div className={classNames("page nft-page")}>
      <PageTransition
        preset="moveToLeftUnfoldRight"
        transitionKey={location.pathname}
      >
        <div className="inner-page">{renderByStatusPart()}</div>
      </PageTransition>
    </div>
  );
}

export default NFTPage;
