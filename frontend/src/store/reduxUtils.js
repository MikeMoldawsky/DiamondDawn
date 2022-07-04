import _ from 'lodash'

export const makeReducer = (actionHandlers={}, initialState={}, globalReset = true) => (state=initialState, action) => {
  if (action.type === 'RESET_STATE' && globalReset) {
    return  initialState
  }
  if (_.isFunction(actionHandlers[action.type])) {
    return actionHandlers[action.type](state, action)
  }
  return state
}