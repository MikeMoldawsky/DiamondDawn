import React from "react";
import map from "lodash/map";
import { useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import DiamondThumbnail from "components/DiamondThumbnail";

const NFTGallery = ({ goToProcess, selectToken }) => {
  const tokens = useSelector(tokensSelector);

  return (
    <div className="center-aligned-row gallery">
      {map(tokens, (token) => (
        <div className="gallery-item">
          <DiamondThumbnail
            key={`token-gallery-${token.id}`}
            diamond={token}
            onClick={() => selectToken(token.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NFTGallery;
