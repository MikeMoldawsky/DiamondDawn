import React from "react";
import classNames from "classnames";
import "./Button.scss";
import useButtonSFX from "hooks/useButtonSFX";

const Button = ({ className, onClick, disabled, children, sfx, ...props }) => {
  const { hoverWithSFX, clickWithSFX } = useButtonSFX(onClick, sfx, { disabled })

  return (
    <button
      className={classNames("button", className, { disabled, unmuteDelay: 2500 })}
      onClick={clickWithSFX}
      onMouseEnter={hoverWithSFX}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
