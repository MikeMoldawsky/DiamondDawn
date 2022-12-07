import React, { useCallback } from "react";
import "./VideoBackground.scss";
import { getCDNVideoUrl } from "utils";
import ReactPlayer from "react-player";
import PlayButton, { TRAILERS } from "components/PlayButton/PlayButton";
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
          <CTAButton />
        </div>
        <div className="center-aligned-row play-buttons">
          <div className="separator" />
          <PlayButton className="element" videos={TRAILERS} index={0} />
          <div className="separator" />
          <PlayButton className="element" videos={TRAILERS} index={1} />
        </div>
      </div>
    </div>
  );
};

export default VideoBackground;
