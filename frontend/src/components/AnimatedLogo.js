import React from "react";
import ReactPlayer from "react-player";
import { createVideoSources } from "utils";
import classNames from "classnames";

const AnimatedLogo = ({ withText }) => {
  return (
    <ReactPlayer
      url={createVideoSources("infinity-720")}
      playing
      playsinline
      controls={false}
      playIcon={null}
      muted
      loop
      className={classNames("react-player loader", { "with-text": withText })}
      width=""
      height=""
    />
  );
};

export default AnimatedLogo;
