import { makeReducer, reduceUpdateFull } from './reduxUtils'
import _ from 'lodash'
import { BigNumber } from 'ethers'
import axios from "axios";
import { STAGE } from "consts";

const INITIAL_STATE = {
  ddContractData: null,
  stage: -1,
  isStageActive: false,
  paused: false,
  stageStartTimes: {},
  minePrice: BigNumber.from(0),
}

export const fetchPricing = contract => async dispatch => {
  const minePrice = await contract.MINING_PRICE()

  dispatch({
    type: 'SYSTEM.SET_PRICE',
    payload: { minePrice },
  })
}

export const fetchStage = contract => async dispatch => {
  const _stage = await contract.stage()
  const _isStageActive = await contract.isStageActive()
  dispatch(setStage(_stage, _isStageActive))
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

export const setDDContractData = (ddContractData) => ({
  type: 'SYSTEM.SET_DD_CONTRACT_DATA',
  payload: { ddContractData },
})

export const systemSelector = state => state.system

export const systemReducer = makeReducer({
  'SYSTEM.SET_STAGE': reduceUpdateFull,
  'SYSTEM.SET_PRICE': reduceUpdateFull,
  'SYSTEM.SET_PAUSED': reduceUpdateFull,
  'SYSTEM.SET_STAGES_CONFIG': reduceUpdateFull,
  'SYSTEM.SET_DD_CONTRACT_DATA': reduceUpdateFull,
}, INITIAL_STATE)
