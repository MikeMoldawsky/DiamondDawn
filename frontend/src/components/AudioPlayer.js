import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { getCDNAudioUrl } from "utils";
import ReactAudioPlayer from "react-audio-player";

const AudioPlayer = () => {
  const { muted, musicSrc } = useSelector(uiSelector);
  const [src, setSrc] = useState("");
  const audio = useRef(null);

  useEffect(() => {
    if (!musicSrc) return;

    if (src) {
      let interval = setInterval(() => {
        if (audio.current.audioEl.current.volume > 0) {
          try {
            audio.current.audioEl.current.volume -= 0.01;
          } catch (e) {
            clearInterval(interval);
            setSrc(musicSrc);
            audio.current.audioEl.current.volume = 0;
          }
        } else {
          clearInterval(interval);
          setSrc(musicSrc);
          audio.current.audioEl.current.volume = 0;
        }
      }, 20);
    } else {
      audio.current.audioEl.current.volume = 0;
      setSrc(musicSrc);
    }
  }, [musicSrc]);

  useEffect(() => {
    console.log("AudioPlayer", { muted, src })
    if (!audio.current?.audioEl?.current) return;

    if (!muted && src) {
      audio.current.audioEl.current.play();
    } else {
      audio.current.audioEl.current.pause();
    }
  }, [muted, src]);

  return (
    <ReactAudioPlayer
      ref={audio}
      src={src ? getCDNAudioUrl(src) : null}
      autoPlay
      muted={muted}
      loop
      volume={0.5}
    />
  );
};

export default AudioPlayer;
