import axios from "axios";

// CONTRACTS
export const getContractDataApi = async () => {
  try {
    if (process.env.REACT_APP_USE_LOCAL_CONTRACT === "true") {
      return {
        ddContract: await import("contracts/DiamondDawn.json"),
        ddMineContract: await import("contracts/DiamondDawnMine.json"),
      };
    }
    const { data } = await axios.get(`/api/get_contract`);
    return data;
  } catch (e) {
    console.error("Failed to get contract data!!!!", e);
    return null;
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

export const logEruptionTxApi = async (txHash) => {
  try {
    const res = await axios.post(`/api/log_eruption_tx`, { txHash });
    return res.data;
  } catch (e) {
    return null;
  }
};

export const clearEruptionTxsApi = async () => {
  try {
    const res = await axios.post(`/api/clear_eruption_txs`);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const updateStageTimeApi = async (timestamp) => {
  try {
    const res = await axios.post(`/api/update_stage_time`, { timestamp });
    return res.data;
  } catch (e) {
    return [];
  }
};

// DIAMONDS
export const getDiamondsApi = async () => {
  try {
    const res = await axios.get(`/api/get_diamonds`);
    return res.data;
  } catch (e) {
    return [];
  }
};

export const addDiamondApi = async (diamond) => {
  try {
    const { data } = await axios.post(`/api/create_diamond`, diamond);
    return data;
  } catch (e) {
    return null;
  }
};

export const updateDiamondApi = async (diamond) => {
  try {
    const { data } = await axios.post(`/api/update_diamond`, diamond);
    return data;
  } catch (e) {
    return null;
  }
};

export const deleteDiamondApi = async (diamondId) => {
  try {
    const { data } = await axios.post(`/api/delete_diamond`, { diamondId });
    return data;
  } catch (e) {
    return null;
  }
};

// INVITE
export const getInvitesApi = async () => {
  try {
    const res = await axios.get(`/api/get_invites`);
    return res.data;
  } catch (e) {
    return [];
  }
};

export const createInviteApi = async () => {
  try {
    const res = await axios.post(`/api/create_invite`);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const updateInviteApi = async (invite) => {
  try {
    const { data } = await axios.post(`/api/update_invite`, invite);
    return data;
  } catch (e) {
    return null;
  }
};

export const deleteInviteApi = async (inviteId) => {
  try {
    const { data } = await axios.post(`/api/delete_invite`, { inviteId });
    return data;
  } catch (e) {
    return null;
  }
};
