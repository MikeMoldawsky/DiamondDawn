import { makeReducer } from "./reduxUtils";
import _ from "lodash";
import { tokenIdToURI } from "api/contractApi";
import { constants as ethersConsts } from 'ethers'

const INITIAL_STATE = {};

export const readAndWatchAccountTokens = (actionDispatch, contract, provider, address) => async (dispatch, getState) => {
  let tokensToFetch = {}

  const saveToStore = _.debounce(async () => {
    const tokenIdsToFetch = _.reduce(tokensToFetch, (tokenIds, { shouldFetch }, tokenId) => {
      return shouldFetch ? [...tokenIds, parseInt(tokenId)] : tokenIds
    }, [])
    const tokenUris = await Promise.all(
      tokenIdsToFetch.map(tokenId => tokenIdToURI(contract, tokenId, tokensToFetch[tokenId].isBurned))
    )

    console.log('readAndWatchAccountTokens', { tokensToFetch, tokenIdsToFetch, tokenUris })

    actionDispatch({
      type: "TOKENS.SET",
      payload: tokenUris,
    }, "load-nfts");

    tokensToFetch = {}
  }, 100)

  const processEvent = (from, to, tokenId) => {
    console.log('event', { ignore: getState().ui.shouldIgnoreTokenTransferWatch, from, to, tokenId: tokenId.toNumber() })
    if (getState().ui.shouldIgnoreTokenTransferWatch) return

    if (from === address) {
      const isBurned = to === ethersConsts.AddressZero
      tokensToFetch[tokenId] = { shouldFetch: isBurned, isBurned }
    }
    else if (to === address) {
      tokensToFetch[tokenId] = { shouldFetch: true, isBurned: false }
    }
    saveToStore()
  }

  // read past transfers
  const events = await contract.queryFilter(contract.filters.Transfer());
  _.forEach(events, ({args: [from, to, tokenId]}) => processEvent(from, to, tokenId))

  // listen to future transfers
  provider.once("block", () => {
    contract.on('Transfer', processEvent)
  });

}

export const watchTokenMinedBy =
  (address, maxAddressTokenId = -1) =>
  (contract, provider, callback) => {
    console.log("WATCHING TOKEN_MINED_BY", { address, maxAddressTokenId });
    const filter = contract.filters.Transfer(null, address);

    const transferListener = (from, to, tokenId) => {
      const numTokenId = tokenId.toNumber();
      if (maxAddressTokenId === -1 || numTokenId > maxAddressTokenId) {
        console.log("TOKEN MINED EVENT", { from, to, tokenId });
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

export const tokensSelector = (state) => state.tokens;

export const tokenByIdSelector = (tokenId) => (state) =>
  _.get(state.tokens, tokenId);

export const tokensReducer = makeReducer(
  {
    "TOKENS.SET": (state, action) => {
      const nfts = action.payload;
      return {
        ...state,
        ..._.zipObject(
          _.map(nfts, "tokenId"),
          _.map(nfts, ({ tokenUri }, i) => ({
            ...tokenUri,
            id: nfts[i].tokenId,
          }))
        ),
      };
    },
    "TOKENS.SET_TOKEN": (state, action) => {
      const { tokenId, tokenUri } = action.payload;
      return {
        ...state,
        [tokenId]: { ...tokenUri, id: tokenId },
      };
    },
  },
  INITIAL_STATE
);
