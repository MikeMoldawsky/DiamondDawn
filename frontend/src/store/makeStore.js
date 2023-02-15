import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import { systemReducer } from "./systemReducer";
import { uiReducer } from "./uiReducer";
import { tokensReducer } from "./tokensReducer";
import { actionStatusReducer } from "./actionStatusReducer";
import { inviteReducer } from "./inviteReducer";
import { collectorReducer } from "./collectorReducer";
import { videoReducer } from "./videoReducer";
import { communityReducer } from "./communityReducer";

const rootReducer = combineReducers({
  system: systemReducer,
  tokens: tokensReducer,
  collector: collectorReducer,
  invite: inviteReducer,
  ui: uiReducer,
  actionStatus: actionStatusReducer,
  video: videoReducer,
  community: communityReducer,
});

export const makeStore = () => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
};
