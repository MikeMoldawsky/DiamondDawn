import React from "react";
import ReactPlayer from "react-player";
import { getCDNObjectUrl } from "utils";
import logoVideo from "assets/videos/logo.mp4";

const AnimatedLogo = () => {
  return (
    <ReactPlayer
      url={logoVideo}
      playing
      playsinline
      controls={false}
      muted
      loop
      className="react-player loader"
      width="100%"
      config={{
        file: {
          attributes: {
            type: "video/mp4",
          },
        },
      }}
    />
  );
};

export default AnimatedLogo;
