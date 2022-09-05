import { makeReducer, reduceUpdateFull } from "./reduxUtils";

const INITIAL_STATE = {
  selectedTokenId: -1,
  shouldIgnoreTokenTransferWatch: false,
};

export const setSelectedTokenId = (selectedTokenId) => ({
  type: "UI.SET_SELECTED_TOKEN_ID",
  payload: { selectedTokenId },
});

export const setShouldIgnoreTokenTransferWatch = (shouldIgnoreTokenTransferWatch) => ({
  type: "UI.SET_SHOULD_IGNORE_TOKEN_TRANSFER_WATCH",
  payload: { shouldIgnoreTokenTransferWatch },
})

export const uiSelector = (state) => state.ui;

export const uiReducer = makeReducer(
  {
    "UI.SET_SELECTED_TOKEN_ID": reduceUpdateFull,
    "UI.SET_SHOULD_IGNORE_TOKEN_TRANSFER_WATCH": reduceUpdateFull,
  },
  INITIAL_STATE
);
