import React, { useEffect } from "react";
import useSound from "use-sound";
import { useDispatch, useSelector } from "react-redux";
import { toggleMuted, uiSelector } from "store/uiReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { getCDNAudioUrl } from "utils";

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const { muted } = useSelector(uiSelector);
  const [play, { pause }] = useSound(getCDNAudioUrl("bg_music.mp3"), {
    volume: 0.5,
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
