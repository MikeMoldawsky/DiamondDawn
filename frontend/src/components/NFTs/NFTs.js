import React from "react";
import map from "lodash/map";
import size from "lodash/size";
import "./NFTs.scss";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { NavLink, useNavigate } from "react-router-dom";
import { getTokenNextStageName, isTokenActionable } from "utils";
import { setSelectedTokenId } from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import Diamond from "components/Diamond";

const NFTs = () => {
  const tokens = useSelector(tokensSelector);
  const { systemStage, isActive } = useSelector(systemSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToProcess = (tokenId) => (e) => {
    e.stopPropagation();
    dispatch(setSelectedTokenId(tokenId));
    navigate("/process");
  };

  const renderNFTCard = (token) => {
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

  return size(tokens) > 0 ? (
    <div className="box-content nfts">{map(tokens, renderNFTCard)}</div>
  ) : null;
};

export default NFTs;