import { makeReducer, reduceUpdateFull } from './reduxUtils'

const INITIAL_STATE = {
  selectedTokenId: 0,
}

export const setSelectedTokenId = (selectedTokenId) => ({
  type: 'UI.SET_SELECTED_TOKEN_ID',
  payload: { selectedTokenId },
})

export const uiSelector = state => state.ui

export const uiReducer = makeReducer({
  'UI.SET_SELECTED_TOKEN_ID': reduceUpdateFull,
}, INITIAL_STATE)
