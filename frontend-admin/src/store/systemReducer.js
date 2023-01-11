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
  toggleIsMintOpenApi,
  updateStageTimeApi,
} from "api/serverApi";
import { constants as ethersConsts } from "ethers";
import _ from "lodash";

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
  addressesMinted: {},
};

export const watchMintedAddresses =
  (contract, provider) => async (dispatch) => {
    let addressesMinted = {};

    const saveToStore = _.debounce(async () => {
      dispatch({
        type: "SYSTEM.ADD_ADDRESSES_MINTED",
        payload: addressesMinted,
      });

      addressesMinted = {};
    }, 100);

    const processEvent = (from, to) => {
      if (from === ethersConsts.AddressZero) {
        addressesMinted[to] = true;
        saveToStore();
      }
    };

    // read past transfers
    const events = await contract.queryFilter(contract.filters.Transfer());
    if (_.size(events) > 0) {
      _.forEach(events, ({ args: [from, to, tokenId] }) =>
        processEvent(from, to, tokenId)
      );
    } else {
      saveToStore();
    }

    // listen to future transfers
    provider.once("block", () => {
      contract.on("Transfer", processEvent);
    });
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

export const toggleIsMintOpen = (timestamp) => async (dispatch) => {
  await toggleIsMintOpenApi(timestamp);
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
    "SYSTEM.ADD_ADDRESSES_MINTED": (state, action) => ({
      ...state,
      addressesMinted: {
        ...state.addressesMinted,
        ...action.payload,
      },
    }),
  },
  INITIAL_STATE
);
