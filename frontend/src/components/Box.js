import React from "react";
import classNames from "classnames";

const Box = ({ className, style, children }) => (
  <div className={classNames("box", className)} style={style}>
    {children}
  </div>
);

export default Box;
