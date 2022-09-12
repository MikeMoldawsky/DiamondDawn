import React, { useEffect } from "react";
import useSound from "use-sound";
import backgroundMusic from "assets/audio/bg-music.mp3";
import { useDispatch, useSelector } from "react-redux";
import { toggleMuted, uiSelector } from "store/uiReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const { muted } = useSelector(uiSelector);
  const [play, { pause }] = useSound(backgroundMusic, {
    volume: 0.5,
    // playbackRate: 0.5,
    // interrupt: true,
    // soundEnabled: muted,
  });

  useEffect(() => {
    if (muted) {
      pause();
    } else {
      play();
    }
  }, [muted]);

  return (
    <FontAwesomeIcon
      className="menu-icon mute-icon"
      icon={muted ? faVolumeMute : faVolumeUp}
      onClick={() => dispatch(toggleMuted())}
    />
  );
};

export default AudioPlayer;
