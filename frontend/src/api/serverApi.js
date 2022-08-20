import axios from "axios";
import _ from "lodash";
import { SYSTEM_STAGE } from "consts";
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

// SYSTEM SCHEDULE
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
    logApiError(e, "getSystemScheduleApi");
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
