import React from "react";
import ReactPlayer from "react-player";
import { getCDNVideoUrl } from "utils";
import classNames from "classnames";

const AnimatedLogo = ({ withText }) => {
  return (
    <ReactPlayer
      url={getCDNVideoUrl("logo.webm")}
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
