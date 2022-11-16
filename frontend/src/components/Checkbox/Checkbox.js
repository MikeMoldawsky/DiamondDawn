import React from "react";
import classNames from "classnames";
import "./Checkbox.scss";

function Checkbox({ className, register, watch, setValue, name, children }) {
  const checked = watch(name);

  return (
    <div
      className={classNames("checkbox", className)}
      onClick={() => setValue(name, !checked)}
    >
      <input type="checkbox" {...register(name)} />
      <div className={classNames("cbx", { checked })} />
      {children}
    </div>
  );
}

export default Checkbox;
