import _ from "lodash";
import { toast } from "react-toastify";
import { DIAMOND_DAWN_TYPE, ROUGH_SHAPE, SHAPE, SYSTEM_STAGE, TRAIT } from "consts";
import { faGem } from "@fortawesome/free-solid-svg-icons";

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

export const logApiError = (e, funcName) =>
  console.error(`Api Error - ${funcName} Failed`, e);

export const getEnumKeyByValue = (enm, value) => Object.keys(enm)[value];

export const getShapeName = (shape) => getEnumKeyByValue(SHAPE, shape);

export const getStageName = (stage) => getEnumKeyByValue(SYSTEM_STAGE, stage);

export const getTypeByStage = (stage) => {
  switch (stage) {
    case SYSTEM_STAGE.INVITATIONS:
      return DIAMOND_DAWN_TYPE.ENTER_MINE;
    case SYSTEM_STAGE.MINE_OPEN:
      return DIAMOND_DAWN_TYPE.ROUGH;
    case SYSTEM_STAGE.CUT_OPEN:
      return DIAMOND_DAWN_TYPE.CUT;
    case SYSTEM_STAGE.POLISH_OPEN:
      return DIAMOND_DAWN_TYPE.POLISHED;
    case SYSTEM_STAGE.SHIP:
      return DIAMOND_DAWN_TYPE.BURNED;
    case SYSTEM_STAGE.COMPLETE:
      return DIAMOND_DAWN_TYPE.REBORN;
    default:
      return -1;
  }
};

export const getStageByTokenType = (type) => {
  switch (type) {
    case DIAMOND_DAWN_TYPE.ENTER_MINE:
      return SYSTEM_STAGE.INVITATIONS;
    case DIAMOND_DAWN_TYPE.ROUGH:
      return SYSTEM_STAGE.MINE_OPEN;
    case DIAMOND_DAWN_TYPE.CUT:
      return SYSTEM_STAGE.CUT_OPEN;
    case DIAMOND_DAWN_TYPE.POLISHED:
      return SYSTEM_STAGE.POLISH_OPEN;
    case DIAMOND_DAWN_TYPE.BURNED:
      return SYSTEM_STAGE.SHIP;
    case DIAMOND_DAWN_TYPE.REBORN:
      return SYSTEM_STAGE.COMPLETE;
    default:
      return -1;
  }
};

export const getTypeByDisplayType = (displayType) => {
  switch (displayType) {
    case "Mine Entrance":
      return DIAMOND_DAWN_TYPE.ENTER_MINE;
    case "Rough":
      return DIAMOND_DAWN_TYPE.ROUGH;
    case "Cut":
      return DIAMOND_DAWN_TYPE.CUT;
    case "Polished":
      return DIAMOND_DAWN_TYPE.POLISHED;
    case "Burned":
      return DIAMOND_DAWN_TYPE.BURNED;
    case "Reborn":
      return DIAMOND_DAWN_TYPE.REBORN;
    default:
      return DIAMOND_DAWN_TYPE.ENTER_MINE;
  }
}

export const getTokenNextStageName = (token) => {
  if (!token) return SYSTEM_STAGE.MINE_OPEN;

  const tokenType = getTokenTrait(token, TRAIT.type);
  const stage = getStageByTokenType(tokenType);
  return getStageName(stage + 1);
};

export const getTokenTrait = (token, trait) => {
  const t = _.find(token?.attributes, { trait_type: trait });
  if (trait === TRAIT.type) {
    return getTypeByDisplayType(t?.value)
  }
  return t?.value;
};

export const getDiamondIcon = (token) => {
  const type = getTokenTrait(token, TRAIT.type);
  const shapeName = getTokenTrait(token, TRAIT.shape);
  let shape;

  switch (type) {
    case DIAMOND_DAWN_TYPE.ENTER_MINE:
      return faGem;
    case DIAMOND_DAWN_TYPE.ROUGH:
      shape = ROUGH_SHAPE[_.toUpper(shapeName)];
      switch (shape) {
        case ROUGH_SHAPE.MAKEABLE:
          return faGem;
        default:
          return null;
      }
    case DIAMOND_DAWN_TYPE.CUT:
      shape = SHAPE[_.toUpper(shapeName)];
      switch (shape) {
        case SHAPE.PEAR:
          return faGem;
        case SHAPE.ROUND:
          return faGem;
        case SHAPE.OVAL:
          return faGem;
        case SHAPE.RADIANT:
          return faGem;
        default:
          return null;
      }
    case DIAMOND_DAWN_TYPE.POLISHED:
      shape = SHAPE[_.toUpper(shapeName)];
      switch (shape) {
        case SHAPE.PEAR:
          return faGem;
        case SHAPE.ROUND:
          return faGem;
        case SHAPE.OVAL:
          return faGem;
        case SHAPE.RADIANT:
          return faGem;
        default:
          return null;
      }
    case DIAMOND_DAWN_TYPE.BURNED:
      return faGem;
    case DIAMOND_DAWN_TYPE.REBORN:
      return faGem;
    default:
      return null;
  }
};

export const isTokenInStage = (token, stage) =>
  getTokenTrait(token, TRAIT.stage) === stage;

export const isTokenOfType = (token, type) =>
  token && getTokenTrait(token, TRAIT.type) === type;

export const isTokenActionable = (token, systemStage) => {
  if (!token) return false;

  switch (systemStage) {
    case SYSTEM_STAGE.COMPLETE:
      return false;
    default:
      const prevTokenType = getTypeByStage(systemStage - 1);
      return isTokenOfType(token, prevTokenType);
  }
};

export const isTokenDone = (token, systemStage) => {
  if (!token) return false;

  const tokenType = getTokenTrait(token, TRAIT.type);
  const tokenStage = getStageByTokenType(tokenType);
  const isNotProcessedEnough = tokenStage < systemStage - 1;

  switch (systemStage) {
    case SYSTEM_STAGE.COMPLETE:
    case SYSTEM_STAGE.SHIP:
      return tokenType === DIAMOND_DAWN_TYPE.REBORN || isNotProcessedEnough;
    default:
      return isNotProcessedEnough;
  }
};

export const getActionableTokens = (tokens, systemStage) => {
  return _.filter(tokens, (token) => isTokenActionable(token, systemStage));
};
