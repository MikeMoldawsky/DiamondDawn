import { logApiError } from "utils";
import { utils as ethersUtils } from "ethers";

// STATE/STORAGE
export const getSystemStageApi = async (contract) => {
  try {
    const [systemStage, isStageActive] = await Promise.all([
      contract.stage(),
      contract.isStageActive(),
    ]);
    return { systemStage, isStageActive };
  } catch (e) {
    logApiError(e, "getSystemStageApi");
    return -1;
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

// PROCESS
export const enterApi = async (contract, password, minePrice) => {
  try {
    console.log("enterApi", {
      password,
      bytes32Password: ethersUtils.formatBytes32String(password),
      minePrice,
    });
    return contract.enter(ethersUtils.formatBytes32String(password), {
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

export const tokenIdToURI = async (contract, tokenId, isBurned) => {
  const tokenUri = await getTokenUriApi(contract, tokenId, isBurned);
  return {
    tokenId,
    tokenUri: { ...tokenUri, isBurned },
  };
};
