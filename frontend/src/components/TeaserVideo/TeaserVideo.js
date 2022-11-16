import React, { useCallback } from "react";
import "./TeaserVideo.scss";
import { getCDNVideoUrl } from "utils";
import ReactPlayer from "react-player";
import PlayButton from "components/PlayButton";
import classNames from "classnames";

const TeaserVideo = ({ src, overlap }) => {
  const renderTeaserBg = useCallback(
    () => (
      <ReactPlayer
        url={getCDNVideoUrl(src)}
        playing
        playsinline
        controls={false}
        className="react-player"
        muted
        loop
        width=""
        height=""
      />
    ),
    []
  );

  return (
    <div className={classNames("teaser-video", { overlap })}>
      {renderTeaserBg()}
      <PlayButton />
    </div>
  );
};

export default TeaserVideo;
