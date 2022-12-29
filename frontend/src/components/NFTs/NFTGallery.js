import React from "react";
import map from "lodash/map";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { safeParseInt } from "utils";
import { setSelectedTokenId } from "store/uiReducer";
import Diamond from "components/Diamond";
import classNames from "classnames";

const TokenItem = ({ token, select, className }) => {
  return (
    <div className={classNames("gallery-item", className)} onClick={select}>
      <Diamond diamond={token} />
    </div>
  );
};

const NFTGallery = ({ goToProcess }) => {
  const tokens = useSelector(tokensSelector);
  const dispatch = useDispatch();

  const selectToken = (id) => {
    dispatch(setSelectedTokenId(safeParseInt(id)));
  };

  return (
    <div className="center-aligned-row gallery">
      {map(tokens, (token) => (
        <TokenItem
          key={`token-gallery-${token.id}`}
          token={token}
          select={() => selectToken(token.id)}
        />
      ))}
    </div>
  );
};

export default NFTGallery;
