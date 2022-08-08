import {logApiError} from "utils";
import {SYSTEM_STAGE} from "consts";

// STATE/STORAGE
export const getSystemStageApi = async (contract) => {
  try {
    return await contract.systemStage();
  }
  catch (e) {
    logApiError(e, 'getSystemStageApi')
    return SYSTEM_STAGE.UNKNOWN
  }
};

export const getMinePriceApi = async (contract) => {
  try {
    return await contract.MINING_PRICE();
  }
  catch (e) {
    logApiError(e, 'getMinePriceApi')
    return undefined
  }
};

// PROCESS

// TOKEN URIs
export const getTokenUriApi = async (contract, tokenId) => {
  try {
    const tokenUri =  await contract.tokenURI(tokenId);
    return JSON.parse(atob(tokenUri.split(",")[1]))
  }
  catch (e) {
    logApiError(e, 'getTokenUriApi')
    return null
  }
}

const tokenIdsToUris = async (contract, tokenIds) => {
  return Promise.all(
    tokenIds.map(async (element) => {
      const tokenId = element.toNumber()
      const tokenUri = await getTokenUriApi(tokenId);
      return { tokenId, tokenUri };
    })
  );
};

export const getAccountNftsApi = async (contract, address) => {
  try {
    const ownerTokenIds = await contract.getTokenIdsByOwner(address);
    return await tokenIdsToUris(contract, ownerTokenIds);
  }
  catch (e) {
    logApiError(e, 'getAccountNftsApi')
    return []
  }
};

export const getShippingTokensApi = async (contract, address) => {
  try {
    const shippingTokenIds = await contract.getShippingTokenIds(address);
    return await tokenIdsToUris(contract, shippingTokenIds);
  }
  catch (e) {
    logApiError(e, 'getShippingTokensApi')
    return []
  }
}

