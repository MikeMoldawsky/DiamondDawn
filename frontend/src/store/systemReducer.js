import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { BigNumber } from "ethers";
import { getContractInfoApi, getSystemScheduleApi } from "api/serverApi";
import { getMinePriceApi, getSystemStageApi } from "api/contractApi";

const INITIAL_STATE = {
  ddContractInfo: null,
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
  const systemSchedule = await getSystemScheduleApi();
  dispatch({
    type: "SYSTEM.SET_SCHEDULE",
    payload: { systemSchedule },
  });
};

export const loadContractInfo = () => async (dispatch) => {
  const ddContractInfo = await getContractInfoApi();
  dispatch({
    type: "SYSTEM.SET_DD_CONTRACT_INFO",
    payload: { ddContractInfo },
  });
};

export const systemSelector = (state) => state.system;

export const systemReducer = makeReducer(
  {
    "SYSTEM.SET_STAGE": reduceUpdateFull,
    "SYSTEM.SET_PRICE": reduceUpdateFull,
    "SYSTEM.SET_PAUSED": reduceUpdateFull,
    "SYSTEM.SET_SCHEDULE": reduceUpdateFull,
    "SYSTEM.SET_DD_CONTRACT_INFO": reduceUpdateFull,
  },
  INITIAL_STATE,
  false
);
