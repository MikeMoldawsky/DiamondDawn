import _ from "lodash";
import { toast } from "react-toastify";
import { SHAPE, STAGE } from "consts";

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

export const getShapeName = (shape) => getEnumKeyByValue(SHAPE, shape);

export const getStageName = (stage) => getEnumKeyByValue(STAGE, stage);
