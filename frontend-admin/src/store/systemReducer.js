import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { CONTRACTS } from "consts";
import {
  getMineDiamondCountApi,
  getSystemPausedApi,
  getSystemStageApi,
  getVideoUrlsByStageApi,
} from "api/contractApi";
import { getSystemScheduleApi } from "api/serverApi";

const INITIAL_STATE = {
  ddContractData: null,
  ddMineContractData: null,
  systemStage: -1,
  paused: false,
  diamondCount: -1,
  schedule: {},
  videoArt: {},
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

export const loadDiamondCount = (mineContract) => async (dispatch) => {
  const diamondCount = await getMineDiamondCountApi(mineContract);
  dispatch({
    type: "SYSTEM.SET_DIAMOND_COUNT",
    payload: { diamondCount },
  });
};

export const loadSchedule = () => async (dispatch) => {
  const schedule = await getSystemScheduleApi();
  dispatch({
    type: "SYSTEM.SET_SCHEDULE",
    payload: { schedule },
  });
};

export const loadStageArt = (mineContract, systemStage) => async (dispatch) => {
  const videoArt = await getVideoUrlsByStageApi(mineContract, systemStage);
  dispatch({
    type: "SYSTEM.SET_VIDEO_ART",
    payload: { videoArt },
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
    "SYSTEM.SET_DIAMOND_COUNT": reduceUpdateFull,
    "SYSTEM.SET_SCHEDULE": reduceUpdateFull,
    "SYSTEM.SET_VIDEO_ART": reduceUpdateFull,
  },
  INITIAL_STATE
);
