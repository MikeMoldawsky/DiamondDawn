import React from "react";
import ReactPlayer from "react-player";
import {getCDNObjectUrl} from "utils";

const Loading = () => {
  return (
    <div className="center-aligned-column loader-container">
      <ReactPlayer
        url={getCDNObjectUrl("/videos/infinity_logo.mp4")}
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
