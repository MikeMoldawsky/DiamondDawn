import {isPrivateSale} from "utils";
import isEmpty from 'lodash/isEmpty'

export const canAccessDDSelector = state => {
  if (!isPrivateSale()) return true

  return !isEmpty(state.collector) || state.ui.privateSaleAuth
}