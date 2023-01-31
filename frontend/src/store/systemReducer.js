import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import {
  getConfigApi,
  getContractInfoApi,
} from "api/serverApi";
import { getPhasesApi } from "api/contractApi";
import { CONTRACTS } from "consts";
import { isNoContractMode } from "utils";
import get from "lodash/get"

const INITIAL_STATE = {
  ddContractInfo: null,
  currentPhaseName: "mint",
  phases: {},
  isActive: false,
  paused: false,
  config: {},
};

const updateState = (payload) => ({
  type: "SYSTEM.UPDATE_STATE",
  payload,
});

export const loadPhases = (contract) => async (dispatch) => {
  const { phases, isActive } = await getPhasesApi(contract);
  dispatch(updateState({ phases, isActive }));
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

export const phaseSelector = phaseName => state => get(systemSelector(state).phases, phaseName, {})

export const isPhaseActiveSelector = (phaseName) => (state) => {
  const { isActive } = systemSelector(state);
  const { isOpen } = phaseSelector(phaseName)(state);
  return isActive && isOpen;
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
