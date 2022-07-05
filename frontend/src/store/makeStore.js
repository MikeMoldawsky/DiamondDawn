import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { systemReducer } from './systemReducer'
import { uiReducer } from "./uiReducer";

const rootReducer = combineReducers({
  system: systemReducer,
  ui: uiReducer,
})

export const makeStore = () => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
}
