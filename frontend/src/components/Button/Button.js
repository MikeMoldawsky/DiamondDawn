import React from "react";
import classNames from "classnames";
import "./Button.scss"

const Button = ({
  className,
  onClick,
  disabled,
  children,
  ...props
}) => {
  const clickHandler = async (e) => {
    e.preventDefault();
    if (disabled || !onClick) return;
    onClick()
  };

  return (
    <button
      className={classNames("button", className, { disabled })}
      onClick={clickHandler}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
