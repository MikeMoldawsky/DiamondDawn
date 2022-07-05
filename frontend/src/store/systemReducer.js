import { makeReducer, reduceUpdateFull } from './reduxUtils'
import _ from 'lodash'
import { BigNumber } from 'ethers'

const INITIAL_STATE = {
  stage: 0,
  isStageActive: false,
  minePrice: BigNumber.from(0),
  cutPrice: BigNumber.from(0),
  polishPrice: BigNumber.from(0),
  mineAndCutPrice: BigNumber.from(0),
  fullPrice: BigNumber.from(0),
}

export const fetchPricing = (contract) => async (dispatch) => {
  const [minePrice, cutPrice, polishPrice, prepaidCutPrice, prepaidPolishPrice] = await Promise.all([
    contract.MINING_PRICE(),
    contract.CUT_PRICE(),
    contract.POLISH_PRICE(),
    contract.PREPAID_CUT_PRICE(),
    contract.PREPAID_POLISH_PRICE()
  ])

  const prices = _.zipObject(
    ['minePrice', 'cutPrice', 'polishPrice', 'mineAndCutPrice', 'fullPrice'],
    [minePrice, cutPrice, polishPrice, minePrice.add(prepaidCutPrice), minePrice.add(prepaidCutPrice).add(prepaidPolishPrice)]
  )

  dispatch({
    type: 'SYSTEM.SET_PRICE',
    payload: prices,
  })
}

export const setStage = (stage, isStageActive) => ({
  type: 'SYSTEM.SET_STAGE',
  payload: { stage, isStageActive },
})

export const systemSelector = state => state.system

export const systemReducer = makeReducer({
  'SYSTEM.SET_STAGE': reduceUpdateFull,
  'SYSTEM.SET_PRICE': reduceUpdateFull,
}, INITIAL_STATE)
