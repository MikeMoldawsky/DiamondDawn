import { makeReducer } from "store/reduxUtils";
import _ from "lodash";
import isEmpty from "lodash/isEmpty";

// ACTIONS
export const setActionPending = (actionKey) => ({
  type: "ACTION_STATUS.PENDING",
  payload: { actionKey },
});

export const clearActionStatus = (actionKey) => ({
  type: "ACTION_STATUS.CLEAR",
  payload: { actionKey },
});

// SELECTORS
export const actionStatusSelector =
  (actionKey = "") =>
  (state) =>
    _.get(state, ["actionStatus", actionKey], {});

const isActionStatusSelector = (actionKey, status) => (state) =>
  actionStatusSelector(actionKey)(state).status === status;

export const isActionPendingSelector = (actionKey) =>
  isActionStatusSelector(actionKey, "pending");

export const isActionSuccessSelector = (actionKey) =>
  isActionStatusSelector(actionKey, "success");

export const isActionErrorSelector = (actionKey) =>
  isActionStatusSelector(actionKey, "error");

export const isActionCompleteSelector = (actionKey) => (state) => {
  const status = actionStatusSelector(actionKey)(state).status;
  return status === "success" || status === "error";
};

export const isActionFirstCompleteSelector = (actionKey) => (state) =>
  actionStatusSelector(actionKey)(state).firstComplete;

// REDUCER
const reduceStatus = (status) => (state, action) => {
  const { actionKey } = action.payload;
  return {
    ...state,
    [actionKey]: {
      ..._.get(state, actionKey, {}),
      ...status,
    },
  };
};

export const actionStatusReducer = makeReducer(
  {
    "ACTION_STATUS.PENDING": reduceStatus({ status: "pending" }),
    "ACTION_STATUS.SUCCESS": reduceStatus({
      status: "success",
      firstComplete: true,
    }),
    "ACTION_STATUS.ERROR": reduceStatus({
      status: "error",
      firstComplete: true,
    }),
    "ACTION_STATUS.CLEAR": (state, action) => {
      const { actionKey } = action.payload;
      return _.omit(state, actionKey);
    },
  },
  {},
  false
);
