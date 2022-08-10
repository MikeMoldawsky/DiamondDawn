import _ from "lodash";
import { toast } from "react-toastify";
import { DIAMOND_DAWN_TYPE, ROUGH_SHAPE, SHAPE, SYSTEM_STAGE } from "consts";

export const parseError = (e) => {
  let message = _.get(e, "error.data.message", "");
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

export const getEnumKeyByValue = (enm, value) => Object.keys(enm)[value];

export const getShapeName = (shape, stage) => {
  switch (stage) {
    case SYSTEM_STAGE.MINE_OPEN:
      return getEnumKeyByValue(ROUGH_SHAPE, shape);
    case SYSTEM_STAGE.CUT_OPEN:
    case SYSTEM_STAGE.POLISH_OPEN:
      return getEnumKeyByValue(SHAPE, shape);
    default:
      return "UNKNOWN";
  }
};

export const getVideoUrlParamName = (getterParam, stage) => {
  switch (stage) {
    case SYSTEM_STAGE.SHIP:
      return getEnumKeyByValue(DIAMOND_DAWN_TYPE, getterParam);
    default:
      return getShapeName(getterParam, getterParam);
  }
};

export const getSystemStageName = (stage) =>
  getEnumKeyByValue(SYSTEM_STAGE, stage);
