import axios from "axios";
import { logApiError, getCDNContractUrl } from "utils";
import { getGeoLocationApi } from "api/externalApi";

// CONTRACT INFO
export const getContractInfoApi = async () => {
  try {
    if (process.env.REACT_APP_USE_LOCAL_CONTRACT === "true") {
      return {
        ddContract: await import("contracts/DiamondDawn.json"),
        ddMineContract: await import("contracts/DiamondDawnMine.json"),
      };
    }
    if (process.env.REACT_APP_USE_LOCAL_CONTRACT === "cdn") {
      const [{ data: addresses }, { data: ddAbi }, { data: ddMineAbi }] =
        await Promise.all([
          axios.get(
            getCDNContractUrl(`${process.env.NODE_ENV}_contracts.json`)
          ),
          axios.get(getCDNContractUrl("dd_abi.json")),
          axios.get(getCDNContractUrl("dd_mine_abi.json")),
        ]);
      console.log("CDN contracts response", { addresses, ddAbi, ddMineAbi });
      return {
        ddContract: { address: addresses.dd, artifact: { abi: ddAbi } },
        ddMineContract: {
          address: addresses.dd_mine,
          artifact: { abi: ddMineAbi },
        },
      };
    }
    const { data } = await axios.get(`/api/get_contract`);
    return data;
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
  const { data: invite } = await axios.post(`/api/apply_to_dd`, {
    inviteId,
    address,
    ...requestData,
    location,
  });
  return invite;
};

export const viewInviteApi = async (inviteId) => {
  try {
    await axios.post(`/api/view_invite`, { inviteId });
  } catch (e) {}
};

export const openMintWindowApi = async (collectorId, address) => {
  const { data: collector } = await axios.post(`/api/open_mint_window`, {
    collectorId,
    address,
  });
  return collector;
};

export const signMintApi = async (collectorId, address) => {
  const res = await axios.post(`/api/sign_mint`, { collectorId, address });
  return res.data;
};

export const confirmMintedApi = async (collectorId, address) => {
  const res = await axios.post(`/api/confirm_minted`, {
    collectorId,
    address,
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

export const generateInvitationsApi = async (collectorId) => {
  const res = await axios.post(`/api/generate_invitations`, { collectorId });
  return res.data;
};

// Signature
export const signDawnApi = async (address, tokenId) => {
  const res = await axios.post(`/api/sign_dawn`, { address, tokenId });
  return res.data;
};

// Demo
export const privateSaleAuthApi = async (pwd, inviteId) => {
  const res = await axios.post(`/api/demo_auth`, { pwd, inviteId });
  return res.data?.auth;
};
