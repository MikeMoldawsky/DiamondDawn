import isEmpty from "lodash/isEmpty";

export const canAccessDDSelector = (state) => {
  if (process.env.REACT_APP_IS_PRIVATE_SALE !== "true") return true;

  return !isEmpty(state.collector) || state.ui.privateSaleAuth;
};
