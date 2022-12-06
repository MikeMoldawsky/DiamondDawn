import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import isNil from "lodash/isNil";

const resolveDemoAuth = () => {
  const privateSaleAuth =
    process.env.REACT_APP_USE_LOCAL_STORAGE === "true"
      ? localStorage.getItem("privateSaleAuth")
      : null;
  return !isNil(privateSaleAuth) ? Boolean(privateSaleAuth) : false;
};

const INITIAL_STATE = {
  selectedTokenId: -1,
  shouldIgnoreTokenTransferWatch: false,
  muted: true,
  explicitMute: false,
  scroll: 0,
  privateSaleAuth: resolveDemoAuth(),
  showHPLogo: null,
  musicSrc: "",
  assetReadyPages: {},
  mintViewShowInvites: false,
  copyNotification: null,
  geoLocation: null,
};

export const setSelectedTokenId = (selectedTokenId) => ({
  type: "UI.SET_SELECTED_TOKEN_ID",
  payload: { selectedTokenId },
});

export const setShouldIgnoreTokenTransferWatch = (
  shouldIgnoreTokenTransferWatch
) => ({
  type: "UI.SET_SHOULD_IGNORE_TOKEN_TRANSFER_WATCH",
  payload: { shouldIgnoreTokenTransferWatch },
});

export const toggleMuted = (explicit) => (dispatch, getState) => {
  const { muted } = uiSelector(getState());
  const newMuted = !muted;
  dispatch(setMuted(newMuted, explicit));
};

export const updateUiState = (payload) => ({
  type: "UI.UPDATE_STATE",
  payload,
});

export const setMuted = (muted, explicit = false) => ({
  type: "UI.UPDATE_STATE",
  payload: { muted, explicitMute: explicit },
});

export const setAudioMuted = (audioMuted) => ({
  type: "UI.UPDATE_STATE",
  payload: { audioMuted },
});

export const uiSelector = (state) => state.ui;

export const uiReducer = makeReducer(
  {
    "UI.SET_SELECTED_TOKEN_ID": reduceUpdateFull,
    "UI.SET_SHOULD_IGNORE_TOKEN_TRANSFER_WATCH": reduceUpdateFull,
    "UI.UPDATE_STATE": reduceUpdateFull,
  },
  INITIAL_STATE,
  false
);
