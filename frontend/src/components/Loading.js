import React from "react";
import animation from "assets/video/infinity_video.mp4";
import ReactPlayer from "react-player";

const Loading = () => {
  return (
    <ReactPlayer
      url={animation}
      playing
      playsinline
      controls={false}
      muted
      loop
      className="react-player"
      width={300}
    />
  )
}

export default Loading