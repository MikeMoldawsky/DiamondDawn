import React, { useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { setMuted, uiSelector } from "store/uiReducer";

const GLOBAL_SHOW_VIDEO = true;

const VideoPlayer = ({
  children,
  src,
  onEnded,
  onPlay,
  controls,
  videoPlayer,
  playing = true,
  ...props
}) => {
  const { muted } = useSelector(uiSelector);
  const [origMuted] = useState(muted);
  const dispatch = useDispatch();

  const onVideoPlay = () => {
    dispatch(setMuted(true));
    onPlay && onPlay();
  };

  const onVideoEnd = () => {
    if (!origMuted) {
      dispatch(setMuted(false));
    }
    onEnded && onEnded();
  };

  return (
    <div className="video-player" {...props} ref={videoPlayer}>
      {GLOBAL_SHOW_VIDEO ? (
        <ReactPlayer
          url={src}
          playing={playing}
          playsinline
          controls={controls}
          className="react-player"
          onPlay={onVideoPlay}
          onEnded={onVideoEnd}
        />
      ) : (
        <div className="video-placeholder" onClick={onVideoEnd}>
          {children}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
