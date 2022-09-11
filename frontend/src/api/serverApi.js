import axios from "axios";
import { logApiError } from "utils";
import getLocation from "utils/getLocation";

// CONTRACT INFO
export const getContractInfoApi = async () => {
  try {
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
export const openInvite = async (inviteId) => {
  try {
    const { country, state } = getLocation();
    const res = await axios.post(`/api/open_invite`, {
      inviteId,
      country,
      state,
    });
    return res.data;
  } catch (e) {
    return null;
  }
};

export const checkPasswordApi = async (password) => {
  try {
    const { data: isCorrect } = await axios.post(`/api/check_pwd`, {
      password,
    });
    return isCorrect;
  } catch (e) {
    logApiError(e, "checkPasswordApi");
    return false;
  }
};
