import React, { useCallback } from "react";
import "./VideoBackground.scss";
import ReactPlayer from "react-player";
import PlayButton from "components/PlayButton";
import CTAButton from "components/CTAButton";
import {getTrailerVideos} from "assets/videos";
import useWindowDimensions from "hooks/useWindowDimensions";

const VideoBackground = ({ src, overlap = 0 }) => {
  const { width } = useWindowDimensions();

  const renderTeaserBg = useCallback(
    () => (
      <ReactPlayer
        url={src}
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

  const trailerSources = getTrailerVideos(width)

  return (
    <div className="teaser-video" style={{ marginTop: overlap }}>
      {renderTeaserBg()}
      <div className="center-center-aligned-row buttons-row">
        <div className="element">
          <CTAButton />
        </div>
        <div className="center-aligned-row play-buttons">
          <div className="separator" />
          <PlayButton className="element" videos={trailerSources} index={0} />
          <div className="separator" />
          <PlayButton className="element second" videos={trailerSources} index={1} />
        </div>
      </div>
    </div>
  );
};

export default VideoBackground;
