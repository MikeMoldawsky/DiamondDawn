import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import { BigNumber } from "ethers";
import { getConfigApi, getContractInfoApi } from "api/serverApi";
import {
  getMaxEntranceApi,
  getMintPriceApi,
  getMintPriceMarriageApi,
  getSystemStageApi,
} from "api/contractApi";
import {CONTRACTS, EVENTS, SYSTEM_STAGE} from "consts";
import { isNoContractMode } from "utils";
import get from "lodash/get"
import size from "lodash/size"
import debounce from "lodash/debounce"

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

const updateTokensMinted = (addMinted) => ({
  type: "SYSTEM.TOKENS_MINTED",
  payload: { count: addMinted },
})

export const watchTokensMinted = (mineContract) => async (dispatch) => {
  let addMinted = 0

  const updateStore = debounce(() => {
    console.log("Forge adding", addMinted)
    dispatch(updateTokensMinted(addMinted))
    addMinted = 0
  }, 100)

  // listen to future events
  mineContract.on(EVENTS.Forge, (event) => {
    console.log("Forge raised", event)
    addMinted++;
    updateStore()
  })
};

export const loadConfig = () => async (dispatch) => {
  const config = await getConfigApi();
  dispatch(updateState({ config }));
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
    "SYSTEM.TOKENS_MINTED": (state, action) => ({
      ...state,
      tokensMinted: state.tokensMinted + get(action, 'payload.count', 0)
    })
  },
  INITIAL_STATE,
  false
);
