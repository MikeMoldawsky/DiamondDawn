import _ from "lodash";
import { toast } from "react-toastify";
import { ROUGH_SHAPE, SHAPE, SYSTEM_STAGE } from "consts";
import getUnixTime from "date-fns/getUnixTime";
import fromUnixTime from "date-fns/fromUnixTime";
import format from "date-fns/format";

export const parseError = (e) => {
  if (e.response?.data) return e.response.data;
  let message = _.get(e, "error.data.message", "");
  if (!message) {
    message = _.get(e, "error.message", "");
  }
  if (!message) {
    message = _.get(e, "message", "");
    try {
      const startJson = message.indexOf("{");
      const endJson = message.lastIndexOf("}") + 1;
      const sub = message.substr(startJson, endJson - startJson);
      console.log({ sub, startJson, endJson });
      message = JSON.parse(sub);
      message = _.get(message, "value.data.message");
    } catch (err) {
      // do nothing
    }
  }
  if (!message) return "Unknown error";

  console.log("ERROR BEFORE PARSE: ", { message });

  message = message
    .replace(
      "Error: VM Exception while processing transaction: reverted with reason string 'P2D: ",
      ""
    )
    .substring(0);
  message = message
    .replace(
      "Error: VM Exception while processing transaction: reverted with reason string '",
      ""
    )
    .substring(0);
  return message.substring(0, message.length - 1);
};

export const showError = (e, prefix = "Error") => {
  const errorMessage = `${prefix} - ${parseError(e)}`;
  toast.error(errorMessage);
  console.error(errorMessage);
};

export const showSuccess = toast.success;

export const getEnumKeyByValue = (enm, value) => _.invert(enm)[value];

export const getShapeName = (shape, stage) => {
  switch (stage) {
    case SYSTEM_STAGE.KEY:
    case SYSTEM_STAGE.MINE:
      return getEnumKeyByValue(ROUGH_SHAPE, shape);
    case SYSTEM_STAGE.CUT:
    case SYSTEM_STAGE.POLISH:
      return getEnumKeyByValue(SHAPE, shape);
    default:
      return "UNKNOWN";
  }
};

export const getSystemStageName = (stage) =>
  getEnumKeyByValue(SYSTEM_STAGE, stage);

export const dateStringToUnix = (dateString) => {
  return getUnixTime(new Date(dateString));
};

export const unixTimestampToDateString = (timestamp) => {
  return format(fromUnixTime(timestamp), "MMMM d, yyyy");
};

export const isNoContractMode = () =>
  process.env.REACT_APP_NO_CONTRACT === "true";

const prependBackslash = (objectPath) =>
  `${objectPath[0] !== "/" ? "/" : ""}${objectPath}`;

const getCDNObjectUrl = (objectPath) =>
  `${process.env.REACT_APP_CDN_URL}${prependBackslash(objectPath)}`;

export const getCDNContractUrl = (objectPath) =>
  getCDNObjectUrl(`/contracts${prependBackslash(objectPath)}`);
