import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { systemReducer } from './systemReducer'
import { uiReducer } from "./uiReducer";
import { tokensReducer } from "./tokensReducer";
import { actionStatusReducer } from "components/ActionButton";
import { whitelistReducer } from './whitelistReducer'

const rootReducer = combineReducers({
  system: systemReducer,
  tokens: tokensReducer,
  ui: uiReducer,
  actionStatus: actionStatusReducer,
  whitelist: whitelistReducer,
})

export const makeStore = () => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
}
