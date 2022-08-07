import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { CONTRACTS } from "consts";

const INITIAL_STATE = {
  ddContractData: null,
  ddMineContractData: null,
  stage: -1,
  paused: false,
  stageStartTimes: {},
};

export const fetchStage = (contract) => async (dispatch) => {
  const _stage = await contract.stage();
  dispatch(setStage(_stage));
};

export const fetchPaused = (contract) => async (dispatch) => {
  const paused = await contract.paused();
  dispatch({
    type: "SYSTEM.SET_PAUSED",
    payload: { paused },
  });
};

export const setStage = (stage) => ({
  type: "SYSTEM.SET_STAGE",
  payload: { stage },
});

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
