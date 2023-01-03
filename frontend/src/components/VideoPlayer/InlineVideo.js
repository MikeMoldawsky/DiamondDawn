import React, {useCallback, useEffect, useState} from "react";
import ReactPlayer from "react-player";
import WaitFor from "containers/WaitFor";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {setAudioMuted, uiSelector} from "store/uiReducer";
import {faVolumeMute, faVolumeUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const InlineVideo = ({
  className,
  src,
  showThreshold = 0,
  withLoader,
  withSound,
  ...props
}) => {
  const [videoProgress, setVideoProgress] = useState({});
  const [muted, setMuted] = useState(!withSound)
  const dispatch = useDispatch();
  const { muted: globalMuted } = useSelector(uiSelector);
  const [wasMutedWhenMounted] = useState(globalMuted);

  useEffect(() => {
    if (!withSound) return

    if (!muted) {
      dispatch(setAudioMuted(true));
    }

    return () => {
      if (!wasMutedWhenMounted) {
        dispatch(setAudioMuted(false));
      }
    }
  }, [withSound])

  const renderVideo = useCallback(() => {
    return (
      <ReactPlayer
        url={src}
        playing
        playsinline
        controls={false}
        muted={muted}
        loop
        className={classNames("react-player", className)}
        {...props}
        width=""
        height=""
        onProgress={setVideoProgress}
      />
    );
  }, [JSON.stringify(src), muted]);

  return (
    <WaitFor
      videos={[{ progress: videoProgress, threshold: showThreshold, src }]}
      withLoader={withLoader}
    >
      {renderVideo()}
      {withSound && (
        <FontAwesomeIcon
          className="video-mute-icon"
          icon={muted ? faVolumeMute : faVolumeUp}
          onClick={() => setMuted(!muted)}
        />
      )}
    </WaitFor>
  );
};

export default InlineVideo;
