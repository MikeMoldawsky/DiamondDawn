import React from "react";
import map from "lodash/map";
import kebabCase from "lodash/kebabCase";
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

const NFTTraits = ({ traits }) => {
  return (
    <div className="traits">
      {map(traits, ({ trait_type, value }, i) => (
        <div
          key={`trait-${kebabCase(trait_type)}-${i}`}
          className="center-aligned-row trait"
        >
          <span>{trait_type}</span>
          <span className="underline" />
          <span>{formatTraitValue(trait_type, value)}</span>
        </div>
      ))}
    </div>
  )
};

export default NFTTraits;
