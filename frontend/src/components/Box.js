import React from "react";
import classNames from "classnames";

const Box = ({ className, children }) => (
  <div className={classNames("box", className)}>
    {children}
  </div>
);

export default Box;
