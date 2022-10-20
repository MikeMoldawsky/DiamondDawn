import React from "react";
import classNames from "classnames";

const Box = ({ className, children }) => (
  <div className={classNames("box", className)}>
    <div className="box-inner">{children}</div>
  </div>
);

export default Box;
