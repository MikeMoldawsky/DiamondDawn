import React, { useCallback } from "react";
import "./VideoBackground.scss";
import { getCDNVideoUrl } from "utils";
import ReactPlayer from "react-player";
import PlayButton from "components/PlayButton";
import CTAButton from "components/CTAButton";

const VideoBackground = ({ src, overlap = 0 }) => {
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
    <div className="teaser-video" style={{ marginTop: overlap }}>
      {renderTeaserBg()}
      <div className="center-center-aligned-row buttons-row">
        <div className="element">
          <CTAButton className="md" />
        </div>
        <div className="separator" />
        <PlayButton
          className="element"
          name="DIGITAL"
          sources={{
            "SHORT": getCDNVideoUrl("short-teaser.webm"),
          }}
        />
        <div className="separator" />
        <PlayButton
          className="element"
          name="PHYSICAL"
          sources={{
            "SHORT": getCDNVideoUrl("physical-teaser.webm"),
          }}
        />
      </div>
    </div>
  );
};

export default VideoBackground;
