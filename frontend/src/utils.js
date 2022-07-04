import _ from 'lodash'

export const parseError = e => {
  let message = _.get(e, 'error.data.message', '')
  if (!message) return 'Unknown error'
  message = message.replace('Error: VM Exception while processing transaction: reverted with reason string \'P2D: ', '').substring(0)
  return message.substring(0, message.length - 1)
}