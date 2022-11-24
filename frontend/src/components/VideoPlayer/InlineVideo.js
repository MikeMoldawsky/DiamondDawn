import React, {useCallback, useState} from "react";
import ReactPlayer from "react-player";
import WaitFor from "containers/WaitFor";
import classNames from "classnames";

const InlineVideo = ({ className, src, showThreshold = 0.5, withLoader = true, ...props }) => {
  const [videoProgress, setVideoProgress] = useState({});

  const renderVideo = useCallback(() => {
    return (
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
    )
  }, [src])

  return (
    <WaitFor videos={[{ progress: videoProgress, threshold: showThreshold }]} withLoader={withLoader}>
      {renderVideo()}
    </WaitFor>
  );
};

export default InlineVideo;
