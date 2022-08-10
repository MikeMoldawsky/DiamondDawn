import { makeReducer } from "./reduxUtils";
import _ from "lodash";
import { getNftsByAddressAlchemyApi } from "api/alchemy";
import {
  getAccountNftsApi,
  getShippingTokensApi,
  getTokenUriApi,
} from "api/contractApi";

const INITIAL_STATE = {};

export const watchTokenMinedBy =
  (address) => (contract, provider, callback) => {
    const filter = contract.filters.Transfer(null, address);

    const transferListener = (from, to, tokenId) => {
      console.log("MINED WITH FILTER", { from, to, tokenId });
      callback(tokenId.toNumber());
    };

    const blockListener = () => {
      contract.on(filter, transferListener);
    };

    provider.once("block", blockListener);

    return () => {
      provider.off("block", blockListener);
      contract.off(filter, transferListener);
    };
  };

export const loadAccountNfts =
  (contract, provider, address) => async (dispatch) => {
    if (!address) return;

    const nfts = await (provider?._network?.chainId === 1
      ? getNftsByAddressAlchemyApi(contract, address)
      : getAccountNftsApi(contract, address));

    dispatch({
      type: "TOKENS.SET",
      payload: nfts,
    });
  };

export const loadAccountShippingTokens =
  (contract, address) => async (dispatch) => {
    if (!address) return;

    const shippingTokens = await getShippingTokensApi(contract, address);

    dispatch({
      type: "TOKENS.SET",
      payload: shippingTokens,
    });
  };

export const loadTokenUri = (contract, tokenId) => async (dispatch) => {
  const tokenUri = await getTokenUriApi(contract, tokenId);
  dispatch(setTokenUri(tokenId, tokenUri));
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
