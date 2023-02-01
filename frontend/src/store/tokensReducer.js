import { makeReducer } from "./reduxUtils";
import uniq from "lodash/uniq"
import debounce from "lodash/debounce"
import reduce from "lodash/reduce"
import size from "lodash/size"
import forEach from "lodash/forEach"
import get from "lodash/get"
import filter from "lodash/filter"
import includes from "lodash/includes"
import some from "lodash/some"
import { tokenIdToURI } from "api/contractApi";
import { constants as ethersConsts } from "ethers";
import { getTokenTrait } from "utils";
import { ACTION_KEYS, EVENTS, SYSTEM_STAGE, TRAIT } from "consts";

const INITIAL_STATE = {
  owned: {},
  minted: false,
  mintedHonorary: false,
};

export const readAndWatchAccountTokens =
  (actionDispatch, contract, provider, address) =>
  async (dispatch, getState) => {
    let displayedTokens = {};
    let mintedTokenIds = []

    const saveToStore = debounce(async () => {
      let displayedTokenIds = reduce(
        displayedTokens,
        (tokenIds, { shouldFetch }, tokenId) => {
          return shouldFetch ? [...tokenIds, parseInt(tokenId)] : tokenIds;
        },
        []
      );

      const tokenIdsToFetch = uniq([...displayedTokenIds, ...mintedTokenIds])

      const tokenUris = await Promise.all(
        tokenIdsToFetch.map((tokenId) =>
          tokenIdToURI(contract, tokenId, displayedTokens[tokenId].isBurned)
        )
      );

      const tokens = filter(tokenUris, ({tokenId}) => includes(displayedTokenIds, tokenId))
      const mintedTokenUris = filter(tokenUris, ({tokenId}) => includes(mintedTokenIds, tokenId))
      const minted = some(mintedTokenUris, ({tokenUri}) => getTokenTrait(tokenUri, TRAIT.Attribute) !== "Honorary")
      const mintedHonorary = some(mintedTokenUris, ({tokenUri}) => getTokenTrait(tokenUri, TRAIT.Attribute) === "Honorary")

      // console.log("SAVING TOKENS TO STORE")
      // console.log({ tokens, mintedTokenUris, minted, mintedHonorary })
      // console.log("--------------------------------------------")

      actionDispatch(
        {
          type: "TOKENS.SET",
          payload: {
            tokens,
            minted,
            mintedHonorary,
          },
        },
        ACTION_KEYS.LOAD_NFTS
      );

      displayedTokens = {};
      mintedTokenIds = []
    }, 100);

    const processEvent = (from, to, tokenId) => {
      if (getState().ui.shouldIgnoreTokenTransferWatch) return;

      if (from === address) {
        const isBurned = to === ethersConsts.AddressZero;
        displayedTokens[tokenId] = { shouldFetch: isBurned, isBurned };
      } else if (to === address) {
        displayedTokens[tokenId] = { shouldFetch: true, isBurned: false };
        if (from === ethersConsts.AddressZero) {
          mintedTokenIds.push(parseInt(tokenId))
        }
      }
      saveToStore();
    };

    // read past transfers
    const events = await contract.queryFilter(contract.filters.Transfer());
    if (size(events) > 0) {
      forEach(events, ({ args: [from, to, tokenId] }) =>
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

export const ownedTokensSelector = (state) => state.tokens.owned;

export const tokenByIdSelector = (tokenId) => (state) =>
  get(ownedTokensSelector(state), tokenId);

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

const reduceToken = (stateTokens, tokenId, tokenUri) => ({
  ...stateTokens,
  [tokenId]: {
    ...tokenUri,
    id: tokenId,
  },
});

export const tokensReducer = makeReducer(
  {
    "TOKENS.SET": (state, action) => {
      const {tokens, minted, mintedHonorary} = action.payload;
      return {
        ...state,
        minted,
        mintedHonorary,
        owned: reduce(
          tokens,
          (newState, { tokenId, tokenUri }) => {
            return reduceToken(newState, tokenId, tokenUri);
          },
          state.owned
        )
      }
    },
    "TOKENS.SET_TOKEN": (state, action) => {
      const { tokenId, tokenUri } = action.payload;
      return {
        ...state,
        owned: reduceToken(state.owned, tokenId, tokenUri),
      };
    },
    "TOKENS.CLEAR": () => INITIAL_STATE,
  },
  INITIAL_STATE
);
