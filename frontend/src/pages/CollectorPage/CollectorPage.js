import React from "react";
import classNames from "classnames";
import map from "lodash/map";
import size from "lodash/size";
import "./CollectorPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getTokenNextStageName,
  isTokenActionable,
} from "utils";
import { setSelectedTokenId } from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import Diamond from "components/Diamond";
import { useAccount } from "wagmi";
import { SYSTEM_STAGE } from "consts";
import Box from "components/Box";
import Suspense from "components/Suspense";
import Invite from "components/Invite"

function CollectorPage() {
  const tokens = useSelector(tokensSelector);
  const { systemStage, isActive } = useSelector(systemSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const account = useAccount();

  const goToProcess = (tokenId) => (e) => {
    e.stopPropagation();
    dispatch(setSelectedTokenId(tokenId));
    navigate("/process");
  };

  const renderTokenCard = (token) => {
    const { name, id } = token;
    return (
      <div key={`token-card-${id}`} className="card-container">
        <div className="token-card">
          <NavLink to={`/nft/${id}`}>
            <div className="token-id">{name}</div>
            <Diamond diamond={token} />
            <div className="card-footer" />
          </NavLink>
          {isTokenActionable(token, systemStage, isActive) && (
            <div className="button" onClick={goToProcess(token.id)}>
              {getTokenNextStageName(token)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (size(tokens) > 0)
      return (
        <div className="box-content nfts">{map(tokens, renderTokenCard)}</div>
      );

    if (systemStage <= SYSTEM_STAGE.FORGE) return (<Invite />)

    return (
      <div className="box-content opaque opensea">
        <div className="secondary-text">You Collection is Empty</div>
        <div className="button link-opensea">GO TO OPENSEA</div>
      </div>
    );
  };

  const suspenseActions = ["get-contract"];
  if (account?.address) {
    suspenseActions.push({ isFirstComplete: true, key: "load-nfts" });
  }

  return (
    <div className={classNames("page collector-page")}>
      <div className="inner-page">
        <h1>The Collector's Room</h1>
        <Box className={"main-box"}>
          <Suspense withLoader actions={suspenseActions} viewName={"THE COLLECTOR'S ROOM"}>
            {renderContent()}
          </Suspense>
        </Box>
      </div>
    </div>
  );
}

export default CollectorPage;
