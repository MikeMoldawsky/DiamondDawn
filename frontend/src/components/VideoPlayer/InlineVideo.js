import React, { useState } from "react";
import ReactPlayer from "react-player";
import WaitFor from "components/WaitFor";

const InlineVideo = ({ src, showThreshold = 0.5, ...props }) => {
  const [videoProgress, setVideoProgress] = useState({});

  return (
    <WaitFor videos={[{ progress: videoProgress, threshold: showThreshold }]}>
      <ReactPlayer
        url={src}
        playing
        playsinline
        controls={false}
        muted
        loop
        className="react-player"
        {...props}
        width=""
        height=""
        onProgress={setVideoProgress}
      />
    </WaitFor>
  );
};

export default InlineVideo;
