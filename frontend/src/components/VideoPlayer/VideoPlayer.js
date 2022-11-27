import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { setAudioMuted, uiSelector } from "store/uiReducer";
import "./VideoPlayer.scss";
import {
  clearVideoState,
  updateVideoState,
  videoSelector,
} from "store/videoReducer";
import useNoScrollView from "hooks/useNoScrollView";
import WaitFor from "containers/WaitFor";
import PageCover from "components/PageCover";
import { useLocation } from "react-router-dom";

const Video = ({ isPlaying, setVideoProgress, ...props }) => {
  useNoScrollView();

  const { muted } = useSelector(uiSelector);
  const [origMuted] = useState(muted);
  const dispatch = useDispatch();

  const { src, closeOnEnd } = useSelector(videoSelector);

  const onVideoPlay = () => {
    dispatch(setAudioMuted(true));
  };

  const onVideoEnd = () => {
    if (!origMuted) {
      dispatch(setAudioMuted(false));
    }
    if (closeOnEnd) {
      dispatch(clearVideoState());
      return;
    }
    dispatch(updateVideoState({ hasEnded: true }));
  };

  return (
    <ReactPlayer
      url={src}
      playing={isPlaying}
      playsinline
      controls
      muted={muted}
      className="react-player video-player"
      onPlay={onVideoPlay}
      onEnded={onVideoEnd}
      {...props}
      width=""
      height=""
      onProgress={setVideoProgress}
    />
  );
};

const VideoPlayer = (props) => {
  const [videoProgress, setVideoProgress] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const { isOpen } = useSelector(videoSelector);

  useEffect(() => {
    dispatch(clearVideoState());
  }, [location?.pathname]);

  if (!isOpen) return null;

  return (
    <div className="full-screen-video">
      <WaitFor
        videos={[{ progress: videoProgress, threshold: 0.25 }]}
        onReady={() => setIsPlaying(true)}
        Loader={() => <PageCover showText text="Video Loading..." />}
      >
        <Video
          isPlaying={isPlaying}
          setVideoProgress={setVideoProgress}
          {...props}
        />
      </WaitFor>
    </div>
  );
};

export default VideoPlayer;
