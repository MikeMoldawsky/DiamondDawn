import React from "react";
import "./DiamondThumbnail.scss";
import Diamond from "components/Diamond";
import classNames from "classnames";

const DiamondThumbnail = ({ diamond, className, ...props }) => {
  return (
    <div className={classNames("diamond-thumbnail", className)} {...props}>
      <Diamond diamond={diamond} />
      <div className="token-id">{diamond.name}</div>
    </div>
  );
};

export default DiamondThumbnail;
