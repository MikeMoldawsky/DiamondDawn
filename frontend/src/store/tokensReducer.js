import { makeReducer } from './reduxUtils'
import _ from 'lodash'

const NFTS_MOCK = [
  { id: 0, stage: 2, cutable: false, polishable: false, shape: 0 },
  // { id: 1, stage: 0, cutable: true, polishable: false, shape: 0 },
  // { id: 2, stage: 0, cutable: true, polishable: true, shape: 0 },
  // { id: 3, stage: 1, cutable: true, polishable: false, shape: 0 },
  // { id: 4, stage: 2, cutable: true, polishable: true, shape: 1 },
  // { id: 5, stage: 3, cutable: true, polishable: true, shape: 2 },
]

const INITIAL_STATE = {}

export const setTokens = (tokens) => ({
  type: 'TOKENS.SET',
  payload: tokens,
})

export const loadAccountTokens = account => async dispatch => {
  try {
    const tokens = NFTS_MOCK
    dispatch(setTokens(tokens))
  }
  catch (e) {

  }
}

export const tokensSelector = state => state.tokens

export const tokenByIdSelector = tokenId => state => _.get(state.tokens, tokenId)

export const tokensReducer = makeReducer({
  'TOKENS.SET': (state, action) => {
    const tokens = action.payload
    return _.keyBy(tokens, 'id')
  },
}, INITIAL_STATE)
