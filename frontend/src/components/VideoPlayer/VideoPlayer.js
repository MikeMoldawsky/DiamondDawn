import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { setMuted, uiSelector } from "store/uiReducer";
import "./VideoPlayer.scss";
import {
  clearVideoState,
  updateVideoState,
  videoSelector,
} from "store/videoReducer";
import useNoScrollView from "hooks/useNoScrollView";
import PageLoader from "components/PageLoader";

const Video = ({ isPlaying, setVideoProgress, ...props }) => {
  useNoScrollView();

  const { muted } = useSelector(uiSelector);
  const [origMuted] = useState(muted);
  const dispatch = useDispatch();

  const { src, closeOnEnd } = useSelector(videoSelector);

  const onVideoPlay = () => {
    dispatch(setMuted(true));
  };

  const onVideoEnd = () => {
    if (!origMuted) {
      dispatch(setMuted(false));
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
      className="react-player"
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

  const { src, isOpen } = useSelector(videoSelector);

  if (!isOpen) return null;

  return (
    <div className="full-screen-video">
      <PageLoader
        pageName={src}
        isPage={false}
        videos={[{ progress: videoProgress, threshold: 0.25 }]}
        onReady={() => setIsPlaying(true)}
        withLoaderText={false}
      >
        <Video
          isPlaying={isPlaying}
          setVideoProgress={setVideoProgress}
          {...props}
        />
      </PageLoader>
    </div>
  );
};

export default VideoPlayer;
