import axios from "axios";
import { getCDNContractUrl } from "utils";

// AUTH
export const adminAuthApi = async (pwd) => {
  let auth = localStorage.getItem("ddAdminAuth") === "true";
  if (!auth) {
    const res = await axios.post(`/api/admin_auth`, { pwd });
    auth = res.data?.auth;
  }
  localStorage.setItem("ddAdminAuth", auth.toString());
  return auth;
};

// CONTRACTS
export const getContractDataApi = async () => {
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
        console.log("CDN contracts response", { addresses, ddAbi, ddMineAbi });
        return {
          ddContract: { address: addresses.dd, artifact: { abi: ddAbi } },
          ddMineContract: {
            address: addresses.dd_mine,
            artifact: { abi: ddMineAbi },
          },
        };
    }
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

// COLLECTORS
export const getCollectorsApi = async (approved) => {
  try {
    const res = await axios.post(`/api/get_collectors`, { approved });
    return res.data;
  } catch (e) {
    return [];
  }
};

export const getDDCollectorApi = async () => {
  try {
    const res = await axios.post(`/api/get_dd_collector`);
    return res.data;
  } catch (e) {
    return [];
  }
};

export const updateCollectorApi = async (update) => {
  try {
    const { data } = await axios.post(`/api/update_collector`, update);
    return data;
  } catch (e) {
    return null;
  }
};

export const approveCollectorApi = async (collectorId) => {
  try {
    const { data } = await axios.post(`/api/approve_collector`, {
      collectorId,
    });
    return data;
  } catch (e) {
    return null;
  }
};

// KEY
export const getInvitationsApi = async () => {
  try {
    const res = await axios.post(`/api/get_invitations`);
    return res.data;
  } catch (e) {
    return [];
  }
};

export const createInvitationApi = async (createdBy, note, inviter, count) => {
  const res = await axios.post(`/api/create_invitation`, {
    createdBy,
    note,
    inviter,
    count,
  });
  return res.data;
};

export const updateInvitationApi = async (invitation) => {
  try {
    const { data } = await axios.post(`/api/update_invitation`, invitation);
    return data;
  } catch (e) {
    return null;
  }
};
