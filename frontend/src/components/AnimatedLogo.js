import React from "react";
import ReactPlayer from "react-player";
import { getCDNVideoUrl } from "utils";

const AnimatedLogo = () => {
  return (
    <ReactPlayer
      url={getCDNVideoUrl("logo.mp4")}
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
