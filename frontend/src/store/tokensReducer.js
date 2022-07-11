import { makeReducer } from './reduxUtils'
import _ from 'lodash'
import { Network, initializeAlchemy, getNftsForOwner } from "@alch/alchemy-sdk";

const INITIAL_STATE = {}

const alchemy = initializeAlchemy({
  apiKey: process.env.REACT_ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
  maxRetries: 10,
});

export const loadAccountNfts = (contract, provider, address) => async dispatch => {
  let nfts = []
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
        response.map((object) => {
          nfts.push({
            tokenId: object?.tokenId,
            tokenUri: object?.tokenUri?.gateway || object?.tokenUri?.raw,
            metadata: object?.rawMetadata,
          });
        });
      });
    } else {
      const nftsOwnedByOwner = await contract.walletOfOwner(address);
      if (nftsOwnedByOwner && nftsOwnedByOwner?.length > 0) {
        nfts = await Promise.all(nftsOwnedByOwner.map(async (element) => {
          const tokenUri = await contract.tokenURI(element.toNumber());
          console.log({ rawTokenUri: atob(tokenUri.split(",")[1]) })
          return { tokenId: element.toNumber(), tokenUri: JSON.parse(atob(tokenUri.split(",")[1])) }
        }))
      }
    }
  }

  dispatch({
    type: 'TOKENS.SET',
    payload: nfts,
  })
};

export const tokensSelector = state => state.tokens

export const tokenByIdSelector = tokenId => state => _.get(state.tokens, tokenId)

export const tokensReducer = makeReducer({
  'TOKENS.SET': (state, action) => {
    const nfts = action.payload
    return _.zipObject(_.map(nfts, 'tokenId'), _.map(nfts, ({ tokenUri }, i) => ({ ...tokenUri, id: nfts[i].tokenId })))
  },
}, INITIAL_STATE)
