import { makeReducer, reduceUpdateFull } from "./reduxUtils";

const INITIAL_STATE = {
  src: "",
  isOpen: false,
  hasEnded: false,
  closeOnEnd: false,
  delayPlay: 0,
};

export const showVideo = (src, opts = {}) => ({
  type: "VIDEO.SHOW",
  payload: { src, delayPlay: 0, ...opts, isOpen: true },
});

export const updateVideoState = (payload) => ({
  type: "VIDEO.UPDATE",
  payload,
});

export const clearVideoState = () => ({
  type: "VIDEO.CLEAR",
});

export const videoSelector = (state) => state.video;

export const videoReducer = makeReducer(
  {
    "VIDEO.SHOW": reduceUpdateFull,
    "VIDEO.UPDATE": reduceUpdateFull,
    "VIDEO.CLEAR": () => INITIAL_STATE,
  },
  INITIAL_STATE
);
