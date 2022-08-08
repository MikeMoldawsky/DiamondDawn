import axios from "axios";
import _ from "lodash";
import {SYSTEM_STAGE} from "consts";

// SYSTEM SCHEDULE
export const fetchSystemSchedule = async () => {
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
    return {};
  }
};