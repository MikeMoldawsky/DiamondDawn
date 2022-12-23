import React from "react";
import ReactPlayer from "react-player";
import {createVideoSources, getCDNVideoUrl} from "utils";
import classNames from "classnames";

const AnimatedLogo = ({ withText }) => {
  return (
    <ReactPlayer
      // url={[{ src: getCDNVideoUrl("infinity.mp4"), type: "video/mp4" }]}
      // url={createVideoSources("infinity")}
      url={createVideoSources("infinity-720")}
      playing
      playsinline
      controls={false}
      muted
      loop
      className={classNames("react-player loader", { "with-text": withText })}
      width=""
      height=""
    />
  );
};

export default AnimatedLogo;
