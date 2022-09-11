import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { BigNumber } from "ethers";
import { getConfigApi, getContractInfoApi } from "api/serverApi";
import { getMinePriceApi, getSystemStageApi } from "api/contractApi";

const INITIAL_STATE = {
  ddContractInfo: null,
  systemStage: -1,
  paused: false,
  config: {},
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
  const { systemStage, isStageActive } = await getSystemStageApi(contract);
  dispatch({
    type: "SYSTEM.SET_STAGE",
    payload: { systemStage, isStageActive },
  });
};

export const loadConfig = () => async (dispatch) => {
  const config = await getConfigApi();
  dispatch({
    type: "SYSTEM.UPDATE_STATE",
    payload: { config },
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
    "SYSTEM.UPDATE_STATE": reduceUpdateFull,
  },
  INITIAL_STATE,
  false
);
