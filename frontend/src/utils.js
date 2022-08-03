import _ from 'lodash'
import { toast } from "react-toastify";
import {NFT_TYPE, SHAPE, STAGE, TRAIT} from "consts";

export const parseError = e => {
  let message = _.get(e, 'error.data.message', '')
  if (!message) {
    message = _.get(e, 'message', '')
    try {
      const startJson = message.indexOf('{')
      const endJson = message.lastIndexOf('}') + 1
      const sub = message.substr(startJson, endJson - startJson)
      console.log({ sub, startJson, endJson })
      message = JSON.parse(sub)
      message = _.get(message, 'value.data.message')
    }
    catch (err) {
      // do nothing
    }
  }
  if (!message) return 'Unknown error'

  console.log('ERROR BEFORE PARSE: ', { message })

  message = message.replace('Error: VM Exception while processing transaction: reverted with reason string \'P2D: ', '').substring(0)
  message = message.replace('Error: VM Exception while processing transaction: reverted with reason string \'', '').substring(0)
  return message.substring(0, message.length - 1)
}

export const showError = (e, prefix = 'Error') => {
  const errorMessage = `${prefix} - ${parseError(e)}`
  toast.error(errorMessage)
  console.error(errorMessage)
}

export const getEnumKeyByValue = (enm, value) => Object.keys(enm)[value]

export const getShapeName = shape => getEnumKeyByValue(SHAPE, shape)

export const getStageName = stage => getEnumKeyByValue(STAGE, stage)

export const getTypeByStage = stage => {
  switch (stage) {
    case STAGE.MINE:
      return NFT_TYPE.Rough
    case STAGE.CUT:
      return NFT_TYPE.Cut
    case STAGE.POLISH:
      return NFT_TYPE.Polished
    case STAGE.BURN:
      return NFT_TYPE.Burned
    case STAGE.REBIRTH:
      return NFT_TYPE.Reborn
    default:
      return NFT_TYPE.Unknown
  }
}

export const getStageByTokenType = type => {
  switch (type) {
    case NFT_TYPE.Rough:
      return STAGE.MINE
    case NFT_TYPE.Cut:
      return STAGE.CUT
    case NFT_TYPE.Polished:
      return STAGE.POLISH
    case NFT_TYPE.Burned:
      return STAGE.BURN
    case NFT_TYPE.Reborn:
      return STAGE.REBIRTH
    default:
      return STAGE.MINE
  }
}

export const getTokenNextStageName = (token) => {
  if (!token) return STAGE.MINE

  const tokenType = getTokenTrait(token, TRAIT.type)
  const stage = getStageByTokenType(tokenType)
  return getStageName(stage + 1)
}

export const getTokenTrait = (token, trait) => {
  const t = _.find(token?.attributes, { trait_type: trait })
  return t?.value
}

export const isTokenInStage = (token, stage) => getTokenTrait(token, TRAIT.stage) === stage
export const isTokenOfType = (token, type) => token && getTokenTrait(token, TRAIT.type) === type

export const isTokenActionable = (token, systemStage) => {
  if (!token) return false

  const tokenType = getTokenTrait(token, TRAIT.type)
  switch (systemStage) {
    case STAGE.REBIRTH:
      return tokenType === NFT_TYPE.Burned;
    case STAGE.BURN:
      return tokenType === NFT_TYPE.Polished || tokenType === NFT_TYPE.Burned;
    default:
      const prevTokenType = getTypeByStage(systemStage - 1)
      return isTokenOfType(token, prevTokenType)
  }
}

export const isTokenDone = (token, systemStage) => {
  if (!token) return false

  const tokenType = getTokenTrait(token, TRAIT.type)
  switch (systemStage) {
    case STAGE.REBIRTH:
    case STAGE.BURN:
      return tokenType === NFT_TYPE.Reborn
    default:
      const tokenStage = getStageByTokenType(tokenType)
      return tokenStage < systemStage - 1
  }
}