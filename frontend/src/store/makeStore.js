import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { systemReducer } from './systemReducer'
import { uiReducer } from "./uiReducer";
import { tokensReducer } from "./tokensReducer";

const rootReducer = combineReducers({
  system: systemReducer,
  tokens: tokensReducer,
  ui: uiReducer,
})

export const makeStore = () => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
}
