import axios from "axios";
import _ from "lodash";
import { SYSTEM_STAGE } from "consts";
import { logApiError } from "utils";

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

// ON-BOARDING
export const getPasswordApi = async (inviteId) => {
  try {
    const { data: password } = await axios.post(`/api/get_pwd`, { inviteId });
    return password;
  } catch (e) {
    logApiError(e, "getPasswordApi");
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
