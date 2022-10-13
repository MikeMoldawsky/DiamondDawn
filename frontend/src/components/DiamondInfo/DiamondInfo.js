import React from "react";
import "./DiamondInfo.scss";
import Diamond from "components/Diamond";
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
  const { name, attributes } = diamond;

  return (
    <div className="diamond-info">
      <Diamond diamond={diamond} />
      <div className="text-content">
        <div className="token-id">{name}</div>
        {_.map(attributes, ({ trait_type, value }, i) => (
          <div
            key={`trait-${_.kebabCase(trait_type)}-${i}`}
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
