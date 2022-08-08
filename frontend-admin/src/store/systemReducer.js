import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { CONTRACTS } from "consts";
import { getSystemPausedApi, getSystemStageApi } from "api/contractApi";

const INITIAL_STATE = {
  ddContractData: null,
  ddMineContractData: null,
  systemStage: -1,
  paused: false,
};

export const loadSystemStage = (contract) => async (dispatch) => {
  const systemStage = await getSystemStageApi(contract);
  dispatch({
    type: "SYSTEM.SET_STAGE",
    payload: { systemStage },
  });
};

export const loadSystemPaused = (contract) => async (dispatch) => {
  const paused = await getSystemPausedApi(contract);
  dispatch({
    type: "SYSTEM.SET_PAUSED",
    payload: { paused },
  });
};

export const setDDContractData = ({ ddContract, ddMineContract }) => ({
  type: "SYSTEM.SET_DD_CONTRACT_DATA",
  payload: { ddContractData: ddContract, ddMineContractData: ddMineContract },
});

export const systemSelector = (state) => state.system;

export const contractSelector =
  (contractType = CONTRACTS.DiamondDawn) =>
  (state) => {
    return contractType === CONTRACTS.DiamondDawn
      ? state.system.ddContractData
      : state.system.ddMineContractData;
  };

export const systemReducer = makeReducer(
  {
    "SYSTEM.SET_STAGE": reduceUpdateFull,
    "SYSTEM.SET_PAUSED": reduceUpdateFull,
    "SYSTEM.SET_STAGES_CONFIG": reduceUpdateFull,
    "SYSTEM.SET_DD_CONTRACT_DATA": reduceUpdateFull,
  },
  INITIAL_STATE
);
