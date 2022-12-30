import { logApiError } from "utils";
import { PROCESS_GAS_LIMIT } from "consts";

// STATE/STORAGE
export const getSystemStageApi = async (contract) => {
  try {
    const [systemStage, isActive] = await Promise.all([
      contract.stage(),
      contract.isActive(),
    ]);
    return { systemStage, isActive };
  } catch (e) {
    logApiError(e, "getSystemStageApi");
    return { systemStage: -1, isActive: false };
  }
};

export const getMinePriceApi = async (contract) => {
  try {
    return await contract.PRICE();
  } catch (e) {
    logApiError(e, "getMinePriceApi");
    return undefined;
  }
};

export const getMaxDiamondsApi = async (contract) => {
  return await contract.maxDiamonds();
};

export const getMineDiamondCountApi = async (mineContract) => {
  return await mineContract.diamondCount();
};

// PROCESS
export const forgeApi = async (contract, minePrice, signature) => {
  return contract.dd.forge(signature, 1, {
    value: minePrice,
    gasLimit: PROCESS_GAS_LIMIT,
  });
};

export const mineApi = async (contract, tokenId) => {
  return contract.mine(tokenId, { gasLimit: PROCESS_GAS_LIMIT });
};

export const cutApi = async (contract, tokenId) => {
  return contract.cut(tokenId, { gasLimit: PROCESS_GAS_LIMIT });
};

export const polishApi = async (contract, tokenId) => {
  return contract.polish(tokenId, { gasLimit: PROCESS_GAS_LIMIT });
};

export const shipApi = async (contract, tokenId) => {
  return contract.ship(tokenId, { gasLimit: PROCESS_GAS_LIMIT });
};

export const dawnApi = async (contract, tokenId, signature) => {
  return contract.dawn(tokenId, signature, {
    gasLimit: PROCESS_GAS_LIMIT,
  });
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

export const tokenIdToURI = async (contract, tokenId, isBurned) => {
  const tokenUri = await getTokenUriApi(contract, tokenId, isBurned);
  return {
    tokenId,
    tokenUri: { ...tokenUri, isBurned },
  };
};
