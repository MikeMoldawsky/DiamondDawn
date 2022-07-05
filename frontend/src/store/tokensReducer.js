import { makeReducer, reduceUpdateFull } from './reduxUtils'
import _ from 'lodash'

const INITIAL_STATE = {
  0: {
    id: 0,
    stage: 0,
    cutable: true,
    polishable: true,
  }
}

export const setTokens = (tokens) => ({
  type: 'TOKENS.SET',
  payload: tokens,
})

export const tokensSelector = state => state.tokens
export const tokenByIdSelector = tokenId => state => ({
  stage: 0,
  cutable: true,
  polishable: true,
})
// export const tokenByIdSelector = tokenId => state => _.get(state.tokens, tokenId)

export const tokensReducer = makeReducer({
  'TOKENS.SET': (state, action) => {
    const tokens = action.payload
    return _.keyBy(tokens, 'id')
  },
}, INITIAL_STATE)
