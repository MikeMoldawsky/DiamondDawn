import { makeReducer } from "store/reduxUtils";
import _ from "lodash";

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
export const actionStatusSelector = (actionKey) => (state) =>
  _.get(state, ["actionStatus", actionKey], "");
export const isActionPendingSelector = (actionKey) => (state) =>
  actionStatusSelector(actionKey)(state) === "pending";

// REDUCER
export const actionStatusReducer = makeReducer(
  {
    "ACTION_STATUS.PENDING": (state, action) => {
      const { actionKey } = action.payload;
      return {
        ...state,
        [actionKey]: "pending",
      };
    },
    "ACTION_STATUS.CLEAR": (state, action) => {
      const { actionKey } = action.payload;
      return _.omit(state, actionKey);
    },
  },
  {}
);
