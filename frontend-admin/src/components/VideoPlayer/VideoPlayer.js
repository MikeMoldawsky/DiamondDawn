import React from 'react'
import ReactPlayer from "react-player";

const VIDEO_URL = 'https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/final.mp4'
const SHOW_VIDEO = true

const VideoPlayer = ({ children, onEnded }) => {
  return SHOW_VIDEO ? (
    <ReactPlayer
      url={VIDEO_URL}
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
  )
}

export default VideoPlayer
