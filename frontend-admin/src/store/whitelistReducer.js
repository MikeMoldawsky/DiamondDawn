import { makeReducer } from './reduxUtils'
import { EVENTS } from "consts";
import _ from "lodash";

const INITIAL_STATE = {}

export const watchWhitelist = (contract) => dispatch => {
  contract.on(EVENTS.WhitelistUpdated, (wlAction, addresses) => {
    dispatch({
      type: 'WHITELIST.PROCESS_CHUNK',
      payload: { wlAction, addresses }
    })
  })
}

const reduceWhitelistChunk = (state, action) => {
  const { wlAction, addresses } = action.payload
  let value = 'No'
  switch (wlAction) {
    case 0: // ADD
      value = 'Yes'
      break
    case 2: // USE
      value = 'Used'
      break
    default: // REMOVE
      value = 'No'
  }
  return {
    ...state,
    ..._.zipObject(addresses, addresses.map(() => value))
  }
}

export const whitelistSelector = state => state.whitelist

export const whitelistReducer = makeReducer({
  'WHITELIST.PROCESS_CHUNK': reduceWhitelistChunk,
}, INITIAL_STATE)
