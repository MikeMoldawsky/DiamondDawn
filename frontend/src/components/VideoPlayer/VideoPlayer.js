import React from "react";
import ReactPlayer from "react-player";
import { DUMMY_VIDEO_URL } from "consts";

const GLOBAL_SHOW_VIDEO = true;

const VideoPlayer = ({
  children,
  src = DUMMY_VIDEO_URL,
  onEnded,
  controls,
  videoPlayer,
  playing = true,
  ...props
}) => {
  return (
    <div className="video-player" {...props} ref={videoPlayer}>
      {GLOBAL_SHOW_VIDEO ? (
        <ReactPlayer
          url={src}
          playing={playing}
          playsinline
          controls={controls}
          muted
          className="react-player"
          onEnded={() => onEnded && onEnded()}
        />
      ) : (
        <div className="video-placeholder" onClick={onEnded}>
          {children}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
