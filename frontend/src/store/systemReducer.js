import { makeReducer, reduceUpdateFull } from './reduxUtils'

const INITIAL_STATE = {
  stage: 0,
  isStageActive: false,
}

export const setStage = (stage, isStageActive) => ({
  type: 'SYSTEM.SET_STAGE',
  payload: { stage, isStageActive },
})

export const systemSelector = state => state.system

export const systemReducer = makeReducer({
  'SYSTEM.SET_STAGE': reduceUpdateFull,
}, INITIAL_STATE)
