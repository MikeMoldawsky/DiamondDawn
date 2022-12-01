import React from "react";
import ReactPlayer from "react-player";
import {createVideoSources} from "utils";
import classNames from "classnames";

const AnimatedLogo = ({ withText }) => {
  return (
    <ReactPlayer
      url={createVideoSources("logo")}
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
