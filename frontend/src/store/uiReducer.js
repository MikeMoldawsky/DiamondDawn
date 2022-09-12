import { makeReducer, reduceUpdateFull } from "./reduxUtils";

const INITIAL_STATE = {
  selectedTokenId: -1,
  shouldIgnoreTokenTransferWatch: false,
  muted: true,
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

export const toggleMuted = () => (dispatch, getState) => {
  const { muted } = uiSelector(getState())
  dispatch({
    type: 'UI.UPDATE_STATE',
    payload: { muted: !muted },
  })
}

export const uiSelector = (state) => state.ui;

export const uiReducer = makeReducer(
  {
    "UI.SET_SELECTED_TOKEN_ID": reduceUpdateFull,
    "UI.SET_SHOULD_IGNORE_TOKEN_TRANSFER_WATCH": reduceUpdateFull,
    "UI.UPDATE_STATE": reduceUpdateFull,
  },
  INITIAL_STATE
);
