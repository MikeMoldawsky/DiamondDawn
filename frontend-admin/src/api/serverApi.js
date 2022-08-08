import axios from "axios";
import _ from "lodash";
import { SYSTEM_STAGE } from "consts";

// CONTRACTS
export const getContractDataApi = async () => {
  try {
    const { data } = await axios.get(`/api/get_contract`);
    return data;
  } catch (e) {
    console.error("Failed to get contract data!!!!", e);
    return null;
  }
};

// SCHEDULE
export const getSystemScheduleApi = async () => {
  try {
    const res = await axios.get(`/api/get_stages`);
    return _.zipObject(
      _.values(SYSTEM_STAGE),
      _.map(_.values(SYSTEM_STAGE), (stage) => {
        const dbConf = _.find(res.data, { stage });
        return dbConf ? dbConf.startsAt : null;
      })
    );
  } catch (e) {
    return [];
  }
};

export const updateSystemScheduleApi = async (stage, startsAt) => {
  try {
    const res = await axios.post(`/api/update_stage`, { stage, startsAt });
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

// INVITATIONS
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
