import React, { useState } from "react";
import ReactPlayer from "react-player";
import Suspense from "components/Suspense";

const InlineVideo = ({ src, showThreshold = .5, ...props }) => {
  const [videoProgress, setVideoProgress] = useState({});

  return (
    <Suspense
      withLoader
      videos={[{ progress: videoProgress, threshold: showThreshold }]}
    >
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
    </Suspense>
  );
};

export default InlineVideo;
