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

export const Radio = ({
  className,
  register,
  watch,
  setValue,
  name,
  value,
  children,
}) => {
  const currValue = watch(name);

  return (
    <div
      className={classNames("radio", className)}
      onClick={() => setValue(name, value)}
    >
      <input {...register(name)} type="radio" value={value} />
      <div className={classNames("cbx", { checked: value === currValue })} />
      {children}
    </div>
  );
};

export default Checkbox;
