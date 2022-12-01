import React, { useCallback, useState } from "react";
import ReactPlayer from "react-player";
import WaitFor from "containers/WaitFor";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";

const InlineVideo = ({
  className,
  src,
  showThreshold = 0.5,
  withLoader = true,
  forceMuted,
  ...props
}) => {
  const { muted } = useSelector(uiSelector);
  const [videoProgress, setVideoProgress] = useState({});

  const renderVideo = useCallback(() => {
    return (
      <ReactPlayer
        url={src}
        playing
        playsinline
        controls={false}
        muted={muted || forceMuted}
        loop
        className={classNames("react-player", className)}
        {...props}
        width=""
        height=""
        onProgress={setVideoProgress}
      />
    );
  }, [JSON.stringify(src)]);

  return (
    <WaitFor
      videos={[{ progress: videoProgress, threshold: showThreshold }]}
      withLoader={withLoader}
    >
      {renderVideo()}
    </WaitFor>
  );
};

export default InlineVideo;
