import { makeReducer, reduceSetFull } from "./reduxUtils";
import {getCollectorByAddressApi, getInviteApi, getInviteByAddressApi, openInviteApi} from "api/serverApi";
import isEmpty from 'lodash/isEmpty'

const INITIAL_STATE = null;

export const updateCollector = (collector) => ({
  type: "COLLECTOR.SET",
  payload: collector,
});

export const loadCollectorByAddress = (address) => async (dispatch) => {
  console.log("loadCollectorByAddress")
  dispatch(clearCollector())
  const collector = await getCollectorByAddressApi(address);
  if (!isEmpty(collector)) {
    dispatch(updateCollector(collector));
  }
};

// export const openCollectorMintWindow = (collectorId) => async (dispatch) => {
//   const invite = await openInviteApi(collectorId);
//   dispatch(updateInvite(invite));
// };

export const clearCollector = () => ({
  type: "COLLECTOR.CLEAR",
});

export const collectorSelector = (state) => state.collector;

export const collectorReducer = makeReducer(
  {
    "COLLECTOR.SET": reduceSetFull,
    "COLLECTOR.CLEAR": () => INITIAL_STATE,
  },
  INITIAL_STATE
);
