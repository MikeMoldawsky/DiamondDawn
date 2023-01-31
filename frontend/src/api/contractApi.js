import { logApiError } from "utils";
import { MINT_GAS_LIMIT } from "consts";
import { constants as ethersConsts } from "ethers";
import size from "lodash/size";

// STATE/STORAGE
const parsePhase = phase => {
  try {
    return {
      address: phase[0],
      name: phase[1],
      maxSupply: phase[2],
      price: phase[3],
      evolved: phase[4],
      isOpen: phase[5],
    }
  }
  catch (e) {
    console.error("Failed to parse phase", phase)
    return null
  }
}

export const getPhasesApi = async (contract) => {
  try {
    const [phase, isActive] = await Promise.all([
      contract._phases("mint"),
      contract.isActive(),
    ]);

    return { phases: { mint: parsePhase(phase) }, isActive }
  } catch (e) {
    logApiError(e, "getPhasesApi");
    return { phases: {}, isActive: false };
  }
};

// PROCESS
export const mintApi = async (
  contract,
  honorary,
  numNfts,
  value,
  signature
) => {
  return (honorary ? contract.mintHonorary : contract.mint)(
    signature,
    numNfts,
    {
      value,
      gasLimit: MINT_GAS_LIMIT,
    }
  );
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
    return totalSupply.toNumber();
  } catch (e) {
    logApiError(e, "getTotalSupplyApi");
    return undefined;
  }
};
