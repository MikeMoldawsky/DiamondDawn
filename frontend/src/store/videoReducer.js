import { makeReducer, reduceUpdateFull } from "./reduxUtils";

const INITIAL_STATE = {
  currentIndex: 0,
  videos: [],
  isOpen: false,
  hasEnded: false,
  closeOnEnd: false,
  delayPlay: 0,
};

export const showVideo = (videos, currentIndex, opts = {}) => ({
  type: "VIDEO.SHOW",
  payload: {
    videos,
    currentIndex,
    delayPlay: 0,
    hasEnded: false,
    ...opts,
    isOpen: true,
  },
});

export const updateVideoState = (payload) => ({
  type: "VIDEO.UPDATE",
  payload,
});

export const clearVideoState = () => ({
  type: "VIDEO.CLEAR",
});

const nextVideoIndex = ({ videos, currentIndex }) => {
  return videos.length > currentIndex + 1 ? currentIndex + 1 : 0;
};

export const videoSelector = (state) => state.video;

export const nextVideoSelector = (state) => {
  const { videos } = state.video;
  if (videos.length <= 1) return { video: null };
  const nextIndex = nextVideoIndex(state.video);
  return { nextVideo: videos[nextIndex], nextIndex };
};

export const videoReducer = makeReducer(
  {
    "VIDEO.SHOW": reduceUpdateFull,
    "VIDEO.UPDATE": reduceUpdateFull,
    "VIDEO.CLEAR": () => INITIAL_STATE,
  },
  INITIAL_STATE
);
