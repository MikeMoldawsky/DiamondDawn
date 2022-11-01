import React from "react";
import ReactPlayer from "react-player";
import { getCDNVideoUrl } from "utils";
import logo from 'assets/videos/logo.webm'
import classNames from "classnames";

const AnimatedLogo = ({ withText }) => {
  return (
    <ReactPlayer
      url={logo}
      // url={getCDNVideoUrl("logo.mp4")}
      playing
      playsinline
      controls={false}
      muted
      loop
      className={classNames("react-player loader", { 'with-text': withText })}
      width="100%"
    />
  );
};

export default AnimatedLogo;
