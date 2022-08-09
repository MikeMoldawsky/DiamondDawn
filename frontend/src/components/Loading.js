import React from "react";
import animation from "assets/video/infinity_video.mp4";
import ReactPlayer from "react-player";

const Loading = () => {
  return (
    <div className="center-aligned-column loader-container">
      <ReactPlayer
        url={animation}
        playing
        playsinline
        controls={false}
        muted
        loop
        className="react-player loader"
        width={300}
      />
    </div>
  );
};

export default Loading;
