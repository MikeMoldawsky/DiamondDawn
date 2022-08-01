import _ from 'lodash'
import { toast } from "react-toastify";
import { SHAPE, STAGE, TRAIT } from "consts";

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

export const getShapeName = shape => {
  switch (shape) {
    case SHAPE.OVAL:
      return 'Oval'
    case SHAPE.RADIANT:
      return 'Radiant'
    case SHAPE.PEAR:
      return 'Pear'
    default:
      return 'Rough'
  }
}

export const getStageName = stage => {
  switch (stage) {
    case STAGE.CUT:
      return 'Cut'
    case STAGE.POLISH:
      return 'Polish'
    case STAGE.BURN:
      return 'Burn'
    case STAGE.REBIRTH:
      return 'Rebirth'
    default:
      return 'Mine'
  }
}

export const getTokenTrait = (token, trait) => {
  const t = _.find(token?.attributes, { trait_type: trait })
  return t?.value
}

export const isTokenInStage = (token, stage) => getTokenTrait(token, TRAIT.stage) === stage