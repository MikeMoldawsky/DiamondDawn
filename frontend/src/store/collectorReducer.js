import { makeReducer, reduceSetFull, reduceUpdateFull } from "./reduxUtils";
import { getCollectorByAddressApi } from "api/serverApi";
import isEmpty from "lodash/isEmpty";
import { createSelector } from "reselect";
import { tokensSelector } from "store/tokensReducer";

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

export const clearCollector = () => ({
  type: "COLLECTOR.CLEAR",
});

export const collectorSelector = createSelector(
  (state) => state.collector,
  tokensSelector,
  (collector, { minted, mintedHonorary }) => {
    return collector
      ? {
          ...collector,
          minted,
          mintedHonorary,
          mintedAll: minted && (!collector.honorary || mintedHonorary),
        }
      : null;
  }
);

export const collectorReducer = makeReducer(
  {
    "COLLECTOR.SET": reduceSetFull,
    "COLLECTOR.UPDATE": reduceUpdateFull,
    "COLLECTOR.CLEAR": () => INITIAL_STATE,
  },
  INITIAL_STATE
);
