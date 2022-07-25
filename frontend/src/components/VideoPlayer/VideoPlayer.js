import React from 'react'
import ReactPlayer from "react-player";
import { DUMMY_VIDEO_URL } from 'consts'

const GLOBAL_SHOW_VIDEO = true

const VideoPlayer = ({ children, onEnded, noVideo }) => {
  return (
    <div className="video-player">
      {(GLOBAL_SHOW_VIDEO && !noVideo) ? (
        <ReactPlayer
          url={DUMMY_VIDEO_URL}
          playing
          playsinline
          controls={false}
          muted
          className="react-player"
          onEnded={() => onEnded && onEnded()}
        />
      ) : (
        <div className="video-placeholder">
          {children}
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
