import { logApiError } from "utils";
import { utils as ethersUtils } from "ethers";

// STATE/STORAGE
export const getSystemStageApi = async (contract) => {
  try {
    return await contract.systemStage();
  } catch (e) {
    logApiError(e, "getSystemStageApi");
    return -1;
  }
};

export const getMinePriceApi = async (contract) => {
  try {
    return await contract.MINING_PRICE();
  } catch (e) {
    logApiError(e, "getMinePriceApi");
    return undefined;
  }
};

// PROCESS
export const enterApi = async (contract, password, minePrice) => {
  try {
    console.log("enterApi", {
      password,
      bytes32Password: ethersUtils.formatBytes32String(password),
      minePrice,
    });
    return await contract.enter(ethersUtils.formatBytes32String(password), {
      value: minePrice,
    });
  } catch (e) {
    logApiError(e, "enterApi");
    throw new Error(e);
  }
};

export const mineApi = async (contract, tokenId) => {
  try {
    return await contract.mine(tokenId);
  } catch (e) {
    logApiError(e, "mineApi");
    throw new Error(e);
  }
};

export const cutApi = async (contract, tokenId) => {
  try {
    return await contract.cut(tokenId);
  } catch (e) {
    logApiError(e, "cutApi");
    throw new Error(e);
  }
};

export const polishApi = async (contract, tokenId) => {
  try {
    return await contract.polish(tokenId);
  } catch (e) {
    logApiError(e, "polishApi");
    throw new Error(e);
  }
};

export const shipApi = async (contract, tokenId) => {
  try {
    return await contract.ship(tokenId);
  } catch (e) {
    logApiError(e, "shipApi");
    throw new Error(e);
  }
};

export const rebirthApi = async (contract, tokenId) => {
  try {
    return await contract.rebirth(tokenId);
  } catch (e) {
    logApiError(e, "rebirthApi");
    throw new Error(e);
  }
};

// TOKEN URI
export const getTokenUriApi = async (contract, tokenId, isBurned) => {
  try {
    const tokenUriString = await contract.tokenURI(tokenId);
    const tokenUri = JSON.parse(atob(tokenUriString.split(",")[1]));
    return { ...tokenUri, isBurned };
  } catch (e) {
    logApiError(e, "getTokenUriApi");
    return null;
  }
};

const tokenIdsToUris = async (contract, tokenIds, isBurned) => {
  return Promise.all(
    tokenIds.map(async (element) => {
      const tokenId = element.toNumber();
      const tokenUri = await getTokenUriApi(contract, tokenId, isBurned);
      return {
        tokenId,
        tokenUri: { ...tokenUri, isBurned },
      };
    })
  );
};

export const getAccountNftsApi = async (contract, address) => {
  try {
    const ownerTokenIds = await contract.getTokenIdsByOwner(address);
    return await tokenIdsToUris(contract, ownerTokenIds);
  } catch (e) {
    logApiError(e, "getAccountNftsApi");
    return [];
  }
};

export const getShippingTokensApi = async (contract, address) => {
  try {
    const shippingTokenIds = await contract.getShippingTokenIds(address);
    return await tokenIdsToUris(contract, shippingTokenIds, true);
  } catch (e) {
    logApiError(e, "getShippingTokensApi");
    return [];
  }
};
