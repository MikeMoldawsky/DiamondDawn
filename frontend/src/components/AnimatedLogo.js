import React from "react";
import ReactPlayer from "react-player";
import { getCDNObjectUrl } from "utils";

const AnimatedLogo = () => {
  return (
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
  );
};

export default AnimatedLogo;
