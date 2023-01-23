import React from "react";
import "./CTAAndTrailers.scss";
import PlayButton from "components/PlayButton";
import CTAButton from "components/CTAButton";
import { getTrailerVideos } from "assets/videos";
import useWindowDimensions from "hooks/useWindowDimensions";

const CTAAndTrailers = () => {
  const { width, height } = useWindowDimensions();

  const trailerSources = getTrailerVideos(width, height);

  return (
    <div className="center-aligned-column cta-and-trailers">
      <div className="element">
        <CTAButton />
      </div>
      <div className="center-aligned-row play-buttons">
        <PlayButton className="element" videos={trailerSources} index={0} />
        <div className="separator" />
        <PlayButton
          className="element second"
          videos={trailerSources}
          index={1}
        />
      </div>
    </div>
  );
};

export default CTAAndTrailers;
