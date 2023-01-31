import React from "react";
import map from "lodash/map";
import { useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import DiamondThumbnail from "components/DiamondThumbnail";
import classNames from "classnames";

const NFTGallery = ({ goToProcess, selectToken }) => {
  const tokens = useSelector(tokensSelector);

  return (
    <div className={classNames("center-aligned-row gallery")}>
      {map(tokens, (token) => (
        <div key={`token-gallery-${token.id}`} className="gallery-item">
          <DiamondThumbnail
            diamond={token}
            onClick={() => selectToken(token.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NFTGallery;
