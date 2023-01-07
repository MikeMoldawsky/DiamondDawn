import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { BigNumber } from "ethers";
import { getConfigApi, getContractInfoApi } from "api/serverApi";
import {
  getMaxEntranceApi,
  getMintPriceApi,
  getMintPriceMarriageApi,
  getSystemStageApi,
  getTokenCountApi,
} from "api/contractApi";
import { CONTRACTS, SYSTEM_STAGE } from "consts";

const INITIAL_STATE = {
  ddContractInfo: null,
  systemStage: -1,
  paused: false,
  config: {},
  mintPrice: BigNumber.from(0),
  maxEntrance: 333,
  tokensMinted: 0,
};

const updateState = (payload) => ({
  type: "SYSTEM.UPDATE_STATE",
  payload,
});

export const loadMintPrice = (contract, geoLocation) => async (dispatch) => {
  const getPrice = geoLocation?.vat ? getMintPriceMarriageApi : getMintPriceApi;
  const mintPrice = await getPrice(contract);
  dispatch(updateState({ mintPrice }));
};

export const loadSystemStage = (contract) => async (dispatch) => {
  const { systemStage, isActive } = await getSystemStageApi(contract);
  dispatch(updateState({ systemStage, isActive }));
};

export const loadMaxEntrance = (contract) => async (dispatch) => {
  const maxEntrance = await getMaxEntranceApi(contract);
  dispatch(updateState({ maxEntrance }));
};

export const loadTokenCount = (mineContract) => async (dispatch) => {
  const tokensMinted = await getTokenCountApi(mineContract);
  dispatch(updateState({ tokensMinted }));
};

export const loadConfig = () => async (dispatch) => {
  const config = await getConfigApi();
  dispatch(updateState({ config }));
};

export const loadContractInfo = () => async (dispatch) => {
  const { ddContract, ddMineContract } = await getContractInfoApi();
  dispatch(
    updateState({
      ddContractInfo: ddContract,
      ddMineContractInfo: ddMineContract,
    })
  );
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
    "SYSTEM.UPDATE_STATE": reduceUpdateFull,
  },
  INITIAL_STATE,
  false
);
