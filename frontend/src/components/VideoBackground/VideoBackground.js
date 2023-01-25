import React, { useCallback } from "react";
import "./VideoBackground.scss";
import ReactPlayer from "react-player";
import CTAAndTrailers from "components/CTAAndTrailers";

const VideoBackground = ({ src, overlap = 0 }) => {
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

  return (
    <div className="teaser-video" style={{ marginTop: overlap }}>
      {renderTeaserBg()}
      <CTAAndTrailers />
    </div>
  );
};

export default VideoBackground;
