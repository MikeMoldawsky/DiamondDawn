import { getNftsForOwner, initializeAlchemy, Network } from "@alch/alchemy-sdk";
import { logApiError } from "utils";

const alchemy = initializeAlchemy({
  apiKey: process.env.REACT_ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
  maxRetries: 10,
});

export const getNftsByAddressAlchemyApi = async (contract, ownerAddress) => {
  try {
    // for mainnet   "https://eth-mainnet.alchemyapi.io/nft/v2/demo/getNFTs/?owner=${addressData?.address}&contractAddresses[]=${contractAddress.DiamondDawn}"
    const { ownedNfts } = await getNftsForOwner(alchemy, ownerAddress, {
      contractAddresses: [contract.address],
    });

    return ownedNfts.map((object) => ({
      tokenId: object?.tokenId,
      tokenUri: object?.tokenUri?.gateway || object?.tokenUri?.raw,
      metadata: object?.rawMetadata,
    }));
  } catch (e) {
    logApiError(e, "getNftsByAddressAlchemyApi");
    return [];
  }
};
