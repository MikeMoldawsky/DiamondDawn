import React from "react";
import "./DiamondInfo.scss";
import Diamond from "components/Diamond";
import _ from "lodash";
import { TRAIT } from "consts";

const formatTraitValue = (trait_type, value) => {
  switch (trait_type) {
    case TRAIT.date:
      const d = new Date(0);
      d.setUTCSeconds(value);
      return d.toDateString();
    default:
      return value;
  }
};

const DiamondInfo = ({ diamond }) => {
  const { id, attributes } = diamond;

  return (
    <div className="diamond-info">
      <Diamond diamond={diamond} />
      <div className="text-content">
        <div className="token-id">NFT #{id}</div>
        {_.map(attributes, ({ trait_type, value }) => (
          <div
            key={`trait-${_.kebabCase(trait_type)}`}
            className="center-aligned-row"
          >
            <span>{trait_type}</span>
            <span>{formatTraitValue(trait_type, value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiamondInfo;
