import React from "react";
import useSound from "use-sound";
import hoverSFX from "assets/audio/button-hover.mp3";
import transitionSFX from "assets/audio/button2-transition.mp3";
import deepSFX from "assets/audio/button3-press-deep.mp3";
import rockLightSFX from "assets/audio/button4-press-rock-light.mp3";
import { useDispatch, useSelector } from "react-redux";
import { setMuted, uiSelector } from "store/uiReducer";

const getSFX = (name) => {
  switch (name) {
    case "utility":
      return transitionSFX;
    case "explore":
      return deepSFX;
    case "action":
      return rockLightSFX;
    default:
      return null;
  }
};

const useButtonSFX = (onClick, sfx, { disabled, unmuteDelay = 0 } = {}) => {
  const { muted, explicitMute } = useSelector(uiSelector);
  const [playHoverSFX, { stop: stopHoverSFX }] = useSound(hoverSFX);
  const [playClickSFX] = useSound(getSFX(sfx), { volume: 1 });
  const dispatch = useDispatch();

  const playSFX = sfx && !disabled && !(muted && explicitMute);

  const clickWithSFX = async (e) => {
    e.preventDefault();
    if (disabled || !onClick) return;
    if (muted && !explicitMute) {
      setTimeout(() => {
        dispatch(setMuted(!muted));
      }, unmuteDelay);
    }
    if (playSFX) {
      stopHoverSFX();
      playClickSFX();
    }
    onClick && onClick(e);
  };

  const hoverWithSFX = () => playSFX && playHoverSFX();

  return { hoverWithSFX, clickWithSFX };
};

export default useButtonSFX;
