import React from "react";
import map from "lodash/map";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { safeParseInt } from "utils";
import { setSelectedTokenId } from "store/uiReducer";
import DiamondThumbnail from "components/DiamondThumbnail";

const NFTGallery = ({ goToProcess }) => {
  const tokens = useSelector(tokensSelector);
  const dispatch = useDispatch();

  const selectToken = (id) => {
    dispatch(setSelectedTokenId(safeParseInt(id)));
  };

  return (
    <div className="center-aligned-row gallery">
      {map(tokens, (token) => (
        <DiamondThumbnail
          key={`token-gallery-${token.id}`}
          className="gallery-item"
          diamond={token}
          onClick={() => selectToken(token.id)}
        />
      ))}
    </div>
  );
};

export default NFTGallery;
