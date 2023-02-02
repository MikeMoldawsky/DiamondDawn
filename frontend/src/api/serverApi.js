import axios from "axios";
import { logApiError, getCDNContractUrl } from "utils";
import { getGeoLocationApi } from "api/externalApi";

// CONTRACT INFO
export const getContractInfoApi = async () => {
  try {
    switch (process.env.REACT_APP_CONTRACT_ORIGIN) {
      case "local":
        return {
          ddContract: await import("contracts/DiamondDawn.json"),
          ddMineContract: await import("contracts/DiamondDawnMine.json"),
        };
      case "db":
        const { data } = await axios.get(`/api/get_contract`);
        return data;
      default:
        const [{ data: addresses }, { data: ddAbi }, { data: ddMineAbi }] =
          await Promise.all([
            axios.get(
              getCDNContractUrl(
                `${process.env.REACT_APP_CONTRACT_ORIGIN}_contracts.json`
              )
            ),
            axios.get(getCDNContractUrl("dd_abi.json")),
            axios.get(getCDNContractUrl("dd_mine_abi.json")),
          ]);
        return {
          ddContract: { address: addresses.dd, artifact: { abi: ddAbi } },
          ddMineContract: {
            address: addresses.dd_mine,
            artifact: { abi: ddMineAbi },
          },
        };
    }
  } catch (e) {
    logApiError(e, "getContractInfoApi");
    return {};
  }
};

// CONFIG
export const getConfigApi = async () => {
  try {
    const { data } = await axios.get(`/api/get_config`);
    return data || {};
  } catch (e) {
    return {};
  }
};

export const getIsMintOpenApi = async (address) => {
  try {
    const { data } = await axios.post(`/api/mint_open`, { address });
    return data;
  } catch (e) {
    return false;
  }
};

// COLLECTOR & INVITATION
export const getInviteApi = async (inviteId) => {
  const res = await axios.post(`/api/get_invite`, { inviteId });
  return res.data;
};

export const getCollectorByAddressApi = async (address) => {
  try {
    const { data: collector } = await axios.post(
      `/api/get_collector_by_address`,
      {
        address,
      }
    );
    return collector;
  } catch (e) {
    return null;
  }
};

export const applyToDDApi = async (
  inviteId,
  address,
  requestData,
  geoLocation
) => {
  if (!geoLocation) {
    try {
      geoLocation = await getGeoLocationApi();
    } catch (e) {
      geoLocation = null;
    }
  }
  const location = geoLocation
    ? `${geoLocation.city},${geoLocation.region}/${geoLocation.country}`
    : "Unknown";
  const { data: collector } = await axios.post(`/api/apply_to_dd`, {
    inviteId,
    address,
    ...requestData,
    location,
  });
  return collector;
};

export const viewInviteApi = async (inviteId) => {
  try {
    await axios.post(`/api/view_invite`, { inviteId });
  } catch (e) {}
};

export const signMintApi = async (collectorId, address, isHonorary) => {
  const res = await axios.post(`/api/sign_mint`, {
    collectorId,
    address,
    isHonorary,
  });
  return res.data;
};

export const changeMintAddressApi = async (
  collectorId,
  address,
  newAddress
) => {
  const res = await axios.post(`/api/change_mint_address`, {
    collectorId,
    address,
    newAddress,
  });
  return res.data;
};

// Signature
export const signDawnApi = async (address, tokenId) => {
  const res = await axios.post(`/api/sign_dawn`, { address, tokenId });
  return res.data;
};

// Demo
export const canEnterDDApi = async (inviteId) => {
  const res = await axios.post(`/api/is_auth`, { inviteId });
  return res.data?.auth;
};
