import React from "react";
import classNames from "classnames";
import "./Button.scss"
import useSound from 'use-sound';
import hoverSFX from "assets/audio/button-hover.mp3"
import transitionSFX from "assets/audio/button2-transition.mp3"
import deepSFX from "assets/audio/button3-press-deep.mp3"
import rockLightSFX from "assets/audio/button4-press-rock-light.mp3"
import {useDispatch, useSelector} from "react-redux";
import {setMuted, uiSelector} from "store/uiReducer";

const getSFX = name => {
  switch (name) {
    case "utility":
      return transitionSFX
    case "explore":
      return deepSFX
    case "action":
      return rockLightSFX
    default:
      return null
  }
}

const Button = ({
  className,
  onClick,
  disabled,
  children,
  sfx,
  ...props
}) => {
  const { muted, explicitMute } = useSelector(uiSelector);
  const [playHover, { stop: stopHover }] = useSound(hoverSFX);
  const [playClick] = useSound(getSFX(sfx));
  const dispatch = useDispatch();

  const playSFX = sfx && !(muted && explicitMute)

  const clickHandler = async (e) => {
    e.preventDefault();
    if (disabled || !onClick) return;
    if (muted && !explicitMute) {
      setTimeout(() => {
        dispatch(setMuted(!muted))
      }, 2500)
    }
    if (playSFX) {
      stopHover()
      playClick()
    }
    onClick && onClick(e)
  };

  return (
    <button
      className={classNames("button", className, { disabled })}
      onClick={clickHandler}
      onMouseEnter={() => playSFX && playHover()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
