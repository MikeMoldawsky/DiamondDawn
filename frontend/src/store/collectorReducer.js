import { makeReducer, reduceSetFull } from "./reduxUtils";
import {
  generateInvitationsApi,
  getCollectorByAddressApi,
  openMintWindowApi,
} from "api/serverApi";
import isEmpty from "lodash/isEmpty";

const INITIAL_STATE = null;

export const updateCollector = (collector) => ({
  type: "COLLECTOR.SET",
  payload: collector,
});

export const loadCollectorByAddress = (address) => async (dispatch) => {
  console.log("loadCollectorByAddress");
  dispatch(clearCollector());
  const collector = await getCollectorByAddressApi(address);
  if (!isEmpty(collector)) {
    dispatch(updateCollector(collector));
  }
};

export const openMintWindow = (collectorId, address) => async (dispatch) => {
  const collector = await openMintWindowApi(collectorId, address);
  dispatch(updateCollector(collector));
};

export const generateInvitations = (collectorId) => async (dispatch) => {
  const collector = await generateInvitationsApi(collectorId);
  dispatch(updateCollector(collector));
};

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
