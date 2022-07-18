import { makeReducer, reduceUpdateFull } from './reduxUtils'
import _ from 'lodash'
import { BigNumber } from 'ethers'
import axios from "axios";
import { STAGE } from "consts";

const INITIAL_STATE = {
  stage: -1,
  isStageActive: false,
  paused: false,
  stageStartTimes: {},
  minePrice: BigNumber.from(0),
  cutPrice: BigNumber.from(0),
  polishPrice: BigNumber.from(0),
  mineAndCutPrice: BigNumber.from(0),
  fullPrice: BigNumber.from(0),
}

export const fetchPricing = contract => async dispatch => {
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

export const fetchStage = contract => async dispatch => {
  const _stage = await contract.stage()
  const _isStageActive = await contract.isStageActive()
  dispatch(setStage(_stage, _isStageActive))
}

export const fetchPaused = contract => async dispatch => {
  const paused = await contract.paused()
  dispatch({
    type: 'SYSTEM.SET_PAUSED',
    payload: { paused },
  })
}

export const getStageConfigs = async () => {
  try {
    const res = await axios.get(`/api/get_stages`)
    return _.zipObject(
      _.values(STAGE),
      _.map(_.values(STAGE), stage => {
        const dbConf = _.find(res.data, { stage })
        return dbConf ? dbConf.startsAt : null
      })
    )
  }
  catch (e) {
    return []
  }
}

export const fetchStagesConfig = () => async dispatch => {
  const stageStartTimes = await getStageConfigs()
  dispatch({
    type: 'SYSTEM.SET_STAGES_CONFIG',
    payload: { stageStartTimes }
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
  'SYSTEM.SET_PAUSED': reduceUpdateFull,
  'SYSTEM.SET_STAGES_CONFIG': reduceUpdateFull,
}, INITIAL_STATE)
