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
} from "api/contractApi";
import { CONTRACTS, EVENTS, SYSTEM_STAGE } from "consts";
import { isNoContractMode } from "utils";
import get from "lodash/get";
import debounce from "lodash/debounce";
import _ from "lodash";

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

const updateTokensMinted = (addMinted) => ({
  type: "SYSTEM.TOKENS_MINTED",
  payload: { count: addMinted },
});

export const watchTokensMinted = (mineContract) => async (dispatch) => {
  let addMinted = 0;

  const updateStore = debounce(() => {
    console.log("Forge adding", addMinted);
    dispatch(updateTokensMinted(addMinted));
    addMinted = 0;
  }, 100);

  // read past transfers
  const forgeEvents = await mineContract.queryFilter(EVENTS.Forge);
  dispatch(updateTokensMinted(forgeEvents.length));

  // listen to future events
  mineContract.on(EVENTS.Forge, (event) => {
    console.log("Forge raised", event);
    addMinted++;
    updateStore();
  });
};

export const loadConfig = () => async (dispatch) => {
  const config = await getConfigApi();
  dispatch(updateState({ config }));
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
    "SYSTEM.TOKENS_MINTED": (state, action) => ({
      ...state,
      tokensMinted: state.tokensMinted + get(action, "payload.count", 0),
    }),
  },
  INITIAL_STATE,
  false
);
