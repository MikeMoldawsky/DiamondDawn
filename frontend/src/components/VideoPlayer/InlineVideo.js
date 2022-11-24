import React, { useState } from "react";
import ReactPlayer from "react-player";
import WaitFor from "containers/WaitFor";
import classNames from "classnames";

const InlineVideo = ({ className, src, showThreshold = 0.5, ...props }) => {
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
        className={classNames("react-player", className)}
        {...props}
        width=""
        height=""
        onProgress={setVideoProgress}
      />
    </WaitFor>
  );
};

export default InlineVideo;
