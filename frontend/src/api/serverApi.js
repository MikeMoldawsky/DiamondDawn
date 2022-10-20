import axios from "axios";
import { logApiError } from "utils";
import getLocation from "utils/getLocation";

// CONTRACT INFO
export const getContractInfoApi = async () => {
  try {
    if (process.env.REACT_APP_USE_LOCAL_CONTRACT === "true") {
      return await import("contracts/DiamondDawn.json");
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

// INVITATION
export const getInviteApi = async (inviteId) => {
  try {
    const res = await axios.post(`/api/get_invite`, { inviteId });
    return res.data;
  } catch (e) {
    return null;
  }
};

export const openInviteApi = async (inviteId, address) => {
  const { country, state } = getLocation();
  const { data: invite } = await axios.post(`/api/open_invite`, {
    inviteId,
    address,
    country,
    state,
  });
  return invite;
};

export const signInviteApi = async (inviteId, address) => {
  const res = await axios.post(`/api/sign_invite`, { inviteId, address });
  return res.data;
};

export const confirmInviteUsedApi = async (inviteId, address) => {
  const res = await axios.post(`/api/confirm_invite_used`, {
    inviteId,
    address,
  });
  return res.data;
};

export const createInviteRequestApi = async (address, requestData) => {
  const { country, state } = getLocation();
  const { data: invite } = await axios.post(`/api/request_invite`, {
    address,
    ...requestData,
    country,
    state,
  });
  return invite;
};

export const getInviteByAddressApi = async (address) => {
  try {
    const { data: invite } = await axios.post(`/api/get_invite_by_address`, {
      address,
    });
    return invite;
  } catch (e) {
    return null;
  }
};

// Signature
export const signDawnApi = async (address, tokenId) => {
  const res = await axios.post(`/api/sign_dawn`, { address, tokenId });
  return res.data;
};

// Demo
export const demoAuthApi = async (pwd) => {
  const res = await axios.post(`/api/demo_auth`, { pwd });
  return res.data?.auth;
};
