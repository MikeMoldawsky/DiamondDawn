import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { BigNumber } from "ethers";
import { getConfigApi, getContractInfoApi } from "api/serverApi";
import {
  getMaxEntranceApi,
  getMinePriceApi,
  getSystemStageApi,
  getTokenCountApi,
} from "api/contractApi";
import { CONTRACTS, SYSTEM_STAGE } from "consts";

const INITIAL_STATE = {
  ddContractInfo: null,
  systemStage: -1,
  paused: false,
  config: {},
  minePrice: BigNumber.from(0),
  maxEntrance: 333,
  tokensMinted: 0,
};

export const loadMinePrice = (contract) => async (dispatch) => {
  const minePrice = await getMinePriceApi(contract);
  dispatch({
    type: "SYSTEM.SET_PRICE",
    payload: { minePrice },
  });
};

export const loadSystemStage = (contract) => async (dispatch) => {
  const { systemStage, isActive } = await getSystemStageApi(contract);
  dispatch({
    type: "SYSTEM.SET_STAGE",
    payload: { systemStage, isActive },
  });
};

export const loadMaxEntrance = (contract) => async (dispatch) => {
  const maxEntrance = await getMaxEntranceApi(contract);
  dispatch({
    type: "SYSTEM.UPDATE_STATE",
    payload: { maxEntrance },
  });
};

export const loadTokenCount = (mineContract) => async (dispatch) => {
  const tokensMinted = await getTokenCountApi(mineContract);
  dispatch({
    type: "SYSTEM.UPDATE_STATE",
    payload: { tokensMinted },
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
  const { ddContract, ddMineContract } = await getContractInfoApi();

  dispatch({
    type: "SYSTEM.SET_DD_CONTRACT_INFO",
    payload: { ddContractInfo: ddContract, ddMineContractInfo: ddMineContract },
  });
};

export const systemSelector = (state) => state.system;

export const isStageActiveSelector = (stage) => (state) => {
  const { systemStage, isActive } = systemSelector(state);
  return systemStage === stage && isActive;
};

export const isMintOpenSelector = isStageActiveSelector(SYSTEM_STAGE.KEY);

export const contractSelector =
  (contractType = CONTRACTS.DiamondDawn) =>
  (state) => {
    return contractType === CONTRACTS.DiamondDawn
      ? state.system.ddContractInfo
      : state.system.ddMineContractInfo;
  };

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
