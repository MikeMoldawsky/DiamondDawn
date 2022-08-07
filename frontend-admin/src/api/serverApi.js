import axios from "axios";
import _ from "lodash";
import {STAGE} from "consts";

// CONTRACTS
export const getContractData = async () => {
  try {
    const { data } = await axios.get(`/api/get_contract`);
    return data
  } catch (e) {
    console.error("Failed to get contract data!!!!", e);
    return null
  }
};

// SCHEDULE
export const getStagesSchedule = async () => {
  try {
    const res = await axios.get(`/api/get_stages`);
    return _.zipObject(
      _.values(STAGE),
      _.map(_.values(STAGE), (stage) => {
        const dbConf = _.find(res.data, { stage });
        return dbConf ? dbConf.startsAt : null;
      })
    );
  } catch (e) {
    return [];
  }
};

export const updateStageSchedule = async (stage, startsAt) => {
  try {
    const res = await axios.post(`/api/update_stage`, { stage, startsAt });
    return res.data;
  } catch (e) {
    return [];
  }
};

// DIAMONDS
export const getEmptyDiamond = () => ({
  reportNumber: "",
  reportDate: "",
  shape: 2,
  carat: 0,
  color: "",
  clarity: "",
  cut: "",
  polish: "",
  symmetry: "",
  fluorescence: "",
  length: 0,
  width: 0,
  depth: 0,
})

export const getAllDiamonds = async () => {
  try {
    const res = await axios.get(`/api/get_diamonds`);
    return res.data;
  } catch (e) {
    return [];
  }
};

export const addDiamond = async (diamond) => {
  try {
    const { data } = await axios.post(`/api/create_diamond`, diamond);
    return data;
  } catch (e) {
    return null;
  }
};

export const updateDiamond = async (diamond) => {
  try {
    const { data } = await axios.post(`/api/update_diamond`, diamond);
    return data;
  } catch (e) {
    return null;
  }
};

export const deleteDiamond = async (diamondId) => {
  try {
    const { data } = await axios.post(`/api/delete_diamond`, { diamondId });
    return data;
  } catch (e) {
    return null;
  }
};

// INVITATIONS
export const getAllInvites = async () => {
  try {
    const res = await axios.get(`/api/get_invites`);
    return res.data;
  } catch (e) {
    return [];
  }
};

export const createInvitation = async () => {
  try {
    const res = await axios.post(`/api/create_invite`);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const updateInvite = async (invite) => {
  try {
    const { data } = await axios.post(`/api/update_invite`, invite);
    return data;
  } catch (e) {
    return null;
  }
};

export const deleteInvite = async (inviteId) => {
  try {
    const { data } = await axios.post(`/api/delete_invite`, { inviteId });
    return data;
  } catch (e) {
    return null;
  }
};