import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { BigNumber } from "ethers";
import { fetchSystemSchedule } from "api/serverApi";
import { getMinePriceApi, getSystemStageApi } from "api/contractApi";

const INITIAL_STATE = {
  ddContractData: null,
  systemStage: -1,
  paused: false,
  systemSchedule: {},
  minePrice: BigNumber.from(0),
};

export const loadMinePrice = (contract) => async (dispatch) => {
  const minePrice = await getMinePriceApi(contract);
  dispatch({
    type: "SYSTEM.SET_PRICE",
    payload: { minePrice },
  });
};

export const loadSystemStage = (contract) => async (dispatch) => {
  const systemStage = await getSystemStageApi(contract);
  dispatch({
    type: "SYSTEM.SET_STAGE",
    payload: { systemStage },
  });
};

export const loadSystemSchedule = () => async (dispatch) => {
  const systemSchedule = await fetchSystemSchedule();
  dispatch({
    type: "SYSTEM.SET_SCHEDULE",
    payload: { systemSchedule },
  });
};

export const setDDContractData = (ddContractData) => ({
  type: "SYSTEM.SET_DD_CONTRACT_DATA",
  payload: { ddContractData },
});

export const systemSelector = (state) => state.system;

export const systemReducer = makeReducer(
  {
    "SYSTEM.SET_STAGE": reduceUpdateFull,
    "SYSTEM.SET_PRICE": reduceUpdateFull,
    "SYSTEM.SET_PAUSED": reduceUpdateFull,
    "SYSTEM.SET_SCHEDULE": reduceUpdateFull,
    "SYSTEM.SET_DD_CONTRACT_DATA": reduceUpdateFull,
  },
  INITIAL_STATE
);
