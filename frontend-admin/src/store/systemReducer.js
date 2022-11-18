import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { CONTRACTS } from "consts";
import {
  getMineDiamondCountApi,
  getSystemPausedApi,
  getSystemStageApi,
  getStageManifestApi,
  getMaxDiamondsApi,
} from "api/contractApi";
import {
  getConfigApi,
  getContractDataApi,
  updateStageTimeApi,
} from "api/serverApi";

const INITIAL_STATE = {
  ddContractData: null,
  ddMineContractData: null,
  systemStage: -1,
  isActive: false,
  paused: false,
  diamondCount: -1,
  config: {},
  videoArt: {},
  maxDiamonds: -1,
};

export const loadSystemStage = (contract) => async (dispatch) => {
  console.log("Loading system stage with contract", contract);
  const { systemStage, isActive } = await getSystemStageApi(contract);
  dispatch({
    type: "SYSTEM.SET_STAGE",
    payload: { systemStage, isActive },
  });
};

export const loadSystemPaused = (contract) => async (dispatch) => {
  const paused = await getSystemPausedApi(contract);
  dispatch({
    type: "SYSTEM.SET_PAUSED",
    payload: { paused },
  });
};
export const loadMaxDiamonds = (contract) => async (dispatch) => {
  const maxDiamonds = await getMaxDiamondsApi(contract);
  dispatch({
    type: "SYSTEM.UPDATE_STATE",
    payload: { maxDiamonds },
  });
};

export const loadDiamondCount = (mineContract) => async (dispatch) => {
  const diamondCount = await getMineDiamondCountApi(mineContract);
  dispatch({
    type: "SYSTEM.SET_DIAMOND_COUNT",
    payload: { diamondCount },
  });
};

export const loadConfig = () => async (dispatch) => {
  const config = await getConfigApi();
  dispatch({
    type: "SYSTEM.UPDATE_STATE",
    payload: { config },
  });
};

export const updateStageTime = (timestamp) => async (dispatch) => {
  await updateStageTimeApi(timestamp);
  dispatch(loadConfig());
};

export const loadStageArt = (mineContract, systemStage) => async (dispatch) => {
  const videoArt = await getStageManifestApi(mineContract, systemStage);
  dispatch({
    type: "SYSTEM.SET_VIDEO_ART",
    payload: { videoArt },
  });
};

export const loadContractInfo = () => async (dispatch) => {
  const { ddContract, ddMineContract } = await getContractDataApi();

  dispatch({
    type: "SYSTEM.SET_DD_CONTRACT_INFO",
    payload: { ddContractData: ddContract, ddMineContractData: ddMineContract },
  });
};

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
    "SYSTEM.SET_DD_CONTRACT_INFO": reduceUpdateFull,
    "SYSTEM.SET_DIAMOND_COUNT": reduceUpdateFull,
    "SYSTEM.SET_SCHEDULE": reduceUpdateFull,
    "SYSTEM.SET_VIDEO_ART": reduceUpdateFull,
    "SYSTEM.UPDATE_STATE": reduceUpdateFull,
  },
  INITIAL_STATE
);
