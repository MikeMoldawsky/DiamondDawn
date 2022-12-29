import React from "react";
import "./DiamondInfo.scss";
import _ from "lodash";
import { TRAIT } from "consts";
import format from "date-fns/format";

const formatTraitValue = (trait_type, value) => {
  switch (trait_type) {
    case TRAIT.date:
      const d = new Date(0);
      d.setUTCSeconds(value);
      return format(d, "MMMM d, yyyy");
    default:
      return value;
  }
};

const DiamondInfo = ({ diamond }) => {
  const { attributes } = diamond;

  return (
    <div className="traits">
      {_.map(attributes, ({ trait_type, value }, i) => (
        <div
          key={`trait-${_.kebabCase(trait_type)}-${i}`}
          className="center-aligned-row trait"
        >
          <span>{trait_type}</span>
          <span>{formatTraitValue(trait_type, value)}</span>
        </div>
      ))}
    </div>
  );
};

export default DiamondInfo;
