import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import { systemReducer } from "./systemReducer";
import { uiReducer } from "./uiReducer";
import { tokensReducer } from "./tokensReducer";
import { actionStatusReducer } from "./actionStatusReducer";
import { inviteReducer } from "store/inviteReducer";
import { collectorReducer } from "store/collectorReducer";

const rootReducer = combineReducers({
  system: systemReducer,
  tokens: tokensReducer,
  collector: collectorReducer,
  invite: inviteReducer,
  ui: uiReducer,
  actionStatus: actionStatusReducer,
});

export const makeStore = () => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
};
