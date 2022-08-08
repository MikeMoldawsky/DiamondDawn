import { makeReducer } from "./reduxUtils";
import _ from "lodash";
import { Network, initializeAlchemy, getNftsForOwner } from "@alch/alchemy-sdk";

const INITIAL_STATE = {};

export const watchTokenMinedBy =
  (address) => (contract, provider, callback) => {
    provider.once("block", () => {
      const filter = contract.filters.Transfer(null, address);
      contract.on(filter, (from, to, tokenId) => {
        console.log("MINED WITH FILTER", { from, to, tokenId });
        contract.on(filter, null);
        callback(tokenId);
      });
    });
  };

export const watchTokenProcessed =
  (tokenId, stage) => (contract, provider, callback) => {
    provider.once("block", () => {
      contract.on("TokenProcessed", (_tokenId, _stage) => {
        const numTokenId = _tokenId.toNumber();
        console.log("TOKEN PROCESSED EVENT", { _tokenId: numTokenId, _stage });
        if (numTokenId === tokenId && _stage === stage) {
          callback(tokenId);
          contract.on("TokenProcessed", null);
        }
      });
    });
  };

const alchemy = initializeAlchemy({
  apiKey: process.env.REACT_ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
  maxRetries: 10,
});

export const loadAccountNfts =
  (contract, provider, address) => async (dispatch) => {
    dispatch({
      type: "ACTION_STATUS.PENDING",
      payload: { actionKey: "load-nfts" },
    });
    let nfts = [];
    if (address) {
      if (provider?._network?.chainId === 1) {
        // for mainnet   "https://eth-mainnet.alchemyapi.io/nft/v2/demo/getNFTs/?owner=${addressData?.address}&contractAddresses[]=${contractAddress.DiamondDawn}"
        await getNftsForOwner(
          alchemy,
          "0x9469c98Be5AFD94cD601E094bc401dDD37F480a3",
          {
            contractAddresses: ["0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"],
          }
        ).then((result) => {
          let response = result?.ownedNfts;
          nfts = response.map((object) => ({
            tokenId: object?.tokenId,
            tokenUri: object?.tokenUri?.gateway || object?.tokenUri?.raw,
            metadata: object?.rawMetadata,
          }));
        });
      } else {
        const ownerTokenIds = await contract.getTokenIdsByOwner(address);
        nfts = await tokenIdsToUris(contract, ownerTokenIds);
      }
    }

    dispatch({
      type: "TOKENS.SET",
      payload: nfts,
    });
    dispatch({
      type: "ACTION_STATUS.SUCCESS",
      payload: { actionKey: "load-nfts" },
    });
  };

export const fetchAccountShippingTokens = (contract, address) => async (dispatch) => {
  dispatch({
    type: "ACTION_STATUS.PENDING",
    payload: { actionKey: "load-shipping-nfts" },
  });

  const shippingTokenIds = await contract.getShippingTokenIds(address);
  const shippingTokens = await tokenIdsToUris(contract, shippingTokenIds);
  console.log({ shippingTokenIds, shippingTokens });

  dispatch({
    type: "TOKENS.SET",
    payload: shippingTokens,
  });
  dispatch({
    type: "ACTION_STATUS.SUCCESS",
    payload: { actionKey: "load-shipping-nfts" },
  });
};

const tokenIdsToUris = async (contract, tokenIds) => {
  return Promise.all(
    tokenIds.map(async (element) => {
      const tokenUri = await contract.tokenURI(element.toNumber());
      return {
        tokenId: element.toNumber(),
        tokenUri: JSON.parse(atob(tokenUri.split(",")[1])),
      };
    })
  );
};

export const fetchTokenUri = (contract, tokenId) => async (dispatch) => {
  const tokenUri = await contract.tokenURI(tokenId);
  dispatch({
    type: "TOKENS.SET_TOKEN",
    payload: { tokenId, tokenUri: JSON.parse(atob(tokenUri.split(",")[1])) },
  });
};

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
