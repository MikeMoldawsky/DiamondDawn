import { logApiError } from "utils";
import { MINT_GAS_LIMIT, PROCESS_GAS_LIMIT } from "consts";
import { constants as ethersConsts } from "ethers";
import size from "lodash/size";

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

export const getMintPriceApi = async (contract) => {
  try {
    return await contract.PRICE();
  } catch (e) {
    logApiError(e, "getMintPriceApi");
    return undefined;
  }
};

export const getMintPriceMarriageApi = async (contract) => {
  try {
    return await contract.PRICE_MARRIAGE();
  } catch (e) {
    logApiError(e, "getMintPriceMarriageApi");
    return undefined;
  }
};

export const getMaxEntranceApi = async (contract) => {
  return await contract.MAX_ENTRANCE();
};

// PROCESS
export const forgeApi = async (
  contract,
  withPartner,
  numNfts,
  mintPrice,
  signature
) => {
  return (withPartner ? contract.forgeWithPartner : contract.forge)(
    signature,
    numNfts,
    {
      value: mintPrice,
      gasLimit: MINT_GAS_LIMIT,
    }
  );
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

// TOKEN
export const getAddressMintedApi = async (contract, address) => {
  const mintEvents = await contract.queryFilter(
    contract.filters.Transfer(ethersConsts.AddressZero, address)
  );
  return size(mintEvents) > 0;
};

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

export const getTotalSupplyApi = async (contract) => {
  try {
    const totalSupply = await contract.totalSupply();
    return totalSupply.toNumber()
  } catch (e) {
    logApiError(e, "getTotalSupplyApi");
    return undefined;
  }
};