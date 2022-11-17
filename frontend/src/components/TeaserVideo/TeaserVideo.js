import React, { useCallback } from "react";
import "./TeaserVideo.scss";
import { getCDNVideoUrl } from "utils";
import ReactPlayer from "react-player";
import PlayButton from "components/PlayButton";
import classNames from "classnames";
import CTAButton from "components/CTAButton";

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
      <div className="center-aligned-row buttons-row">
        <div className="element">
          <CTAButton className="md" />
        </div>
        <div className="separator"/>
        <PlayButton className="element" length="SHORT" />
        <div className="separator"/>
        <PlayButton className="element" length="FULL" disabled title="Full teaser will bill released when public sale starts" />
      </div>
    </div>
  );
};

export default TeaserVideo;
