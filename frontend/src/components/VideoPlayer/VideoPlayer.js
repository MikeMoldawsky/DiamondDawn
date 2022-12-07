import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { setAudioMuted, uiSelector } from "store/uiReducer";
import "./VideoPlayer.scss";
import {
  clearVideoState,
  nextVideoSelector,
  updateVideoState,
  videoSelector,
} from "store/videoReducer";
import useNoScrollView from "hooks/useNoScrollView";
import WaitFor from "containers/WaitFor";
import PageCover from "components/PageCover";
import { useLocation } from "react-router-dom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PlayButton from "components/PlayButton";
import isEmpty from "lodash/isEmpty";

const Video = ({ src, isPlaying, onEnded, setVideoProgress, ...props }) => {
  useNoScrollView();

  const { muted } = useSelector(uiSelector);
  const dispatch = useDispatch();

  const { closeOnEnd } = useSelector(videoSelector);

  const onVideoPlay = () => {
    dispatch(setAudioMuted(true));
  };

  const onVideoEnd = () => {
    if (closeOnEnd) {
      dispatch(clearVideoState());
      return;
    }
    onEnded && onEnded();
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
  const [isStartDelayPlay, setIsStartDelayPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { muted } = useSelector(uiSelector);
  const [wasMutedWhenMounted] = useState(muted);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [showNextVideo, setShowNextVideo] = useState(false);
  const [isPlayNext, setIsPlayNext] = useState(false);
  const { videos, currentIndex, isOpen, delayPlay, hasEnded } =
    useSelector(videoSelector);
  const { src } = videos[currentIndex];
  const { nextVideo, nextIndex } = useSelector(nextVideoSelector);
  const hasNextVideo = !isEmpty(nextVideo);

  const closePlayer = () => {
    dispatch(clearVideoState());
    if (!wasMutedWhenMounted) {
      dispatch(setAudioMuted(false));
    }
  };

  // close player on browse (menu is available when video is open)
  useEffect(() => {
    if (isMounted) {
      closePlayer();
    }
    setIsMounted(true);
  }, [location?.pathname]);

  // handle delayed play
  useEffect(() => {
    let timer;
    if (isStartDelayPlay) {
      timer = setTimeout(() => {
        setIsPlaying(true);
      }, delayPlay);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [delayPlay, isStartDelayPlay]);

  // show next video when a video ends
  useEffect(() => {
    setShowNextVideo(hasEnded && hasNextVideo);
  }, [hasEnded, hasNextVideo]);

  if (!isOpen) return null;

  const playNext = () => {
    setIsPlayNext(true);
    setIsStartDelayPlay(false);
    setIsPlaying(false);
    setVideoProgress({});

    setTimeout(() => {
      setIsPlayNext(false);
    }, 0);
  };

  const onVideoReady = () => {
    if (!delayPlay) {
      return setIsPlaying(true);
    }
    setIsStartDelayPlay(true);
  };

  return (
    <div className="full-screen-video">
      <div className="video-container">
        {!isPlayNext && (
          <WaitFor
            log
            minWait={delayPlay}
            videos={[{ progress: videoProgress, threshold: 0.05, src }]}
            onReady={onVideoReady}
            Loader={() => <PageCover showText text="Video Loading..." />}
          >
            <Video
              src={src}
              isPlaying={isPlaying}
              setVideoProgress={setVideoProgress}
              {...props}
            />
            {showNextVideo && (
              <div className="ended-cover">
                <div className="play-next">
                  <div className="play-next-text">PLAY NEXT:</div>
                  <PlayButton
                    videos={videos}
                    index={nextIndex}
                    onClick={playNext}
                  />
                </div>
              </div>
            )}
            <HighlightOffIcon className="close" onClick={closePlayer} />
          </WaitFor>
        )}
      </div>
    </div>
  );
};

const VideoPlayerContainer = (props) => {
  const { videos } = useSelector(videoSelector);

  return videos.length > 0 ? <VideoPlayer {...props} /> : null;
};

export default VideoPlayerContainer;
