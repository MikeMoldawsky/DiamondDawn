import { makeReducer } from "./reduxUtils";
import _ from "lodash";
import { tokenIdToURI } from "api/contractApi";
import { constants as ethersConsts } from "ethers";
import { getTokenTrait } from "utils";
import { ACTION_KEYS, EVENTS, SYSTEM_STAGE, TRAIT } from "consts";

const INITIAL_STATE = {};

export const readAndWatchAccountTokens =
  (actionDispatch, contract, provider, address) =>
  async (dispatch, getState) => {
    let tokensToFetch = {};

    const saveToStore = _.debounce(async () => {
      const tokenIdsToFetch = _.reduce(
        tokensToFetch,
        (tokenIds, { shouldFetch }, tokenId) => {
          return shouldFetch ? [...tokenIds, parseInt(tokenId)] : tokenIds;
        },
        []
      );
      const tokenUris = await Promise.all(
        tokenIdsToFetch.map((tokenId) =>
          tokenIdToURI(contract, tokenId, tokensToFetch[tokenId].isBurned)
        )
      );

      actionDispatch(
        {
          type: "TOKENS.SET",
          payload: tokenUris,
        },
        ACTION_KEYS.LOAD_NFTS
      );

      tokensToFetch = {};
    }, 100);

    const processEvent = (from, to, tokenId) => {
      if (getState().ui.shouldIgnoreTokenTransferWatch) return;

      if (from === address) {
        const isBurned = to === ethersConsts.AddressZero;
        tokensToFetch[tokenId] = { shouldFetch: isBurned, isBurned };
      } else if (to === address) {
        tokensToFetch[tokenId] = { shouldFetch: true, isBurned: false };
      }
      saveToStore();
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
      contract.on(EVENTS.Transfer, processEvent);
    });
  };

export const watchTokenMinedBy = (
  contract,
  provider,
  address,
  maxAddressTokenId = -1,
  callback
) => {
  const filter = contract.filters.Transfer(null, address);

  const transferListener = (from, to, tokenId) => {
    const numTokenId = tokenId.toNumber();
    if (maxAddressTokenId === -1 || numTokenId > maxAddressTokenId) {
      callback(numTokenId);
    }
  };

  const blockListener = () => {
    contract.on(filter, transferListener);
  };

  provider.once("block", blockListener);

  return () => {
    contract.off(filter, transferListener);
    provider.off("block", blockListener);
  };
};

export const setTokenUri = (tokenId, tokenUri) => ({
  type: "TOKENS.SET_TOKEN",
  payload: { tokenId, tokenUri },
});

export const clearTokens = () => ({ type: "TOKENS.CLEAR" });

// selectors
export const tokensSelector = (state) => state.tokens;

export const tokenByIdSelector = (tokenId) => (state) =>
  _.get(state.tokens, tokenId);

// reducer
const getTokenStageByTypeTrait = (token) => {
  const displayType = getTokenTrait(token, TRAIT.type);
  switch (displayType) {
    case "Key":
      return SYSTEM_STAGE.KEY;
    case "Diamond":
      switch (getTokenTrait(token, TRAIT.stage)) {
        case "Rough":
          return SYSTEM_STAGE.MINE;
        case "Cut":
          return SYSTEM_STAGE.CUT;
        case "Polished":
          return SYSTEM_STAGE.POLISH;
        default:
          return 0;
      }
    case "Certificate":
      return SYSTEM_STAGE.DAWN;
    default:
      return 0;
  }
};

const reduceToken = (state, tokenId, tokenUri) => ({
  ...state,
  [tokenId]: {
    ...tokenUri,
    id: tokenId,
  },
});

export const tokensReducer = makeReducer(
  {
    "TOKENS.SET": (state, action) => {
      const nfts = action.payload;
      return _.reduce(
        nfts,
        (newState, { tokenId, tokenUri }) => {
          return reduceToken(newState, tokenId, tokenUri);
        },
        state
      );
    },
    "TOKENS.SET_TOKEN": (state, action) => {
      const { tokenId, tokenUri } = action.payload;
      return reduceToken(state, tokenId, tokenUri);
    },
    "TOKENS.CLEAR": () => INITIAL_STATE,
  },
  INITIAL_STATE
);
