import {makeReducer, reduceSetFull, reduceUpdateFull} from "./reduxUtils";
import {
  confirmMintedApi,
  getCollectorByAddressApi,
  openMintWindowApi,
} from "api/serverApi";
import isEmpty from "lodash/isEmpty";

const INITIAL_STATE = null;

export const setCollector = (collector) => ({
  type: "COLLECTOR.SET",
  payload: collector,
});

export const updateCollector = (update) => ({
  type: "COLLECTOR.UPDATE",
  payload: update,
});

export const loadCollectorByAddress = (address) => async (dispatch) => {
  const collector = await getCollectorByAddressApi(address);
  if (!isEmpty(collector)) {
    dispatch(setCollector(collector));
  } else {
    dispatch(clearCollector());
  }
};

export const openMintWindow = (collectorId, address) => async (dispatch) => {
  const collector = await openMintWindowApi(collectorId, address);
  dispatch(setCollector(collector));
};

export const clearCollector = () => ({
  type: "COLLECTOR.CLEAR",
});

export const collectorSelector = (state) => state.collector;

export const collectorReducer = makeReducer(
  {
    "COLLECTOR.SET": reduceSetFull,
    "COLLECTOR.UPDATE": reduceUpdateFull,
    "COLLECTOR.CLEAR": () => INITIAL_STATE,
  },
  INITIAL_STATE
);
