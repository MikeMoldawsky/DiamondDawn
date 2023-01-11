import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { BigNumber } from "ethers";
import {
  getConfigApi,
  getContractInfoApi,
  getIsMintOpenApi,
} from "api/serverApi";
import {
  getMaxEntranceApi,
  getMintPriceApi,
  getMintPriceMarriageApi,
  getSystemStageApi,
  getTotalSupplyApi,
} from "api/contractApi";
import { CONTRACTS, SYSTEM_STAGE } from "consts";
import { isNoContractMode } from "utils";

const INITIAL_STATE = {
  ddContractInfo: null,
  systemStage: -1,
  paused: false,
  config: {},
  mintPrice: BigNumber.from(0),
  maxEntrance: 333,
  tokensMinted: 0,
  isMintOpen: false,
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

export const loadConfig = () => async (dispatch) => {
  const config = await getConfigApi();
  dispatch(updateState({ config }));
};

export const loadTotalSupply = (contract) => async (dispatch) => {
  const tokensMinted = await getTotalSupplyApi(contract);
  dispatch(updateState({ tokensMinted }));
};

export const loadIsMintOpen = (address) => async (dispatch) => {
  const { isMintOpen, stageTime } = await getIsMintOpenApi(address);
  dispatch({
    type: "SYSTEM.SET_IS_MINT_OPEN",
    payload: { isMintOpen, stageTime },
  });
};

export const loadContractInfo = () => async (dispatch) => {
  if (isNoContractMode()) return;

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

export const isMintOpenSelector = (state) => {
  return (
    isStageActiveSelector(SYSTEM_STAGE.KEY)(state) &&
    systemSelector(state).isMintOpen
  );
};

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
    "SYSTEM.SET_IS_MINT_OPEN": (state, action) => {
      const { isMintOpen, stageTime } = action.payload;
      return {
        ...state,
        isMintOpen,
        config: {
          ...state.config,
          stageTime,
        },
      };
    },
  },
  INITIAL_STATE,
  false
);
