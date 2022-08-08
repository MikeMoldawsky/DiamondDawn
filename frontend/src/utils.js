import _ from "lodash";
import { toast } from "react-toastify";
import { NFT_TYPE, ROUGH_SHAPE, SHAPE, SYSTEM_STAGE, TRAIT } from "consts";
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
    case SYSTEM_STAGE.MINE_OPEN:
      return NFT_TYPE.Rough;
    case SYSTEM_STAGE.CUT_OPEN:
      return NFT_TYPE.Cut;
    case SYSTEM_STAGE.POLISH_OPEN:
      return NFT_TYPE.Polished;
    case SYSTEM_STAGE.SHIP:
      return NFT_TYPE.Burned;
    case SYSTEM_STAGE.COMPLETE:
      return NFT_TYPE.Reborn;
    default:
      return NFT_TYPE.Unknown;
  }
};

export const getStageByTokenType = (type) => {
  switch (type) {
    case NFT_TYPE.Rough:
      return SYSTEM_STAGE.MINE_OPEN;
    case NFT_TYPE.Cut:
      return SYSTEM_STAGE.CUT_OPEN;
    case NFT_TYPE.Polished:
      return SYSTEM_STAGE.POLISH_OPEN;
    case NFT_TYPE.Burned:
      return SYSTEM_STAGE.SHIP;
    case NFT_TYPE.Reborn:
      return SYSTEM_STAGE.COMPLETE;
    default:
      return SYSTEM_STAGE.MINE_OPEN;
  }
};

export const getTokenNextStageName = (token) => {
  if (!token) return SYSTEM_STAGE.MINE_OPEN;

  const tokenType = getTokenTrait(token, TRAIT.type);
  const stage = getStageByTokenType(tokenType);
  return getStageName(stage + 1);
};

export const getTokenTrait = (token, trait) => {
  const t = _.find(token?.attributes, { trait_type: trait });
  return t?.value;
};

export const getDiamondIcon = (token) => {
  const type = getTokenTrait(token, TRAIT.type);
  const shapeName = getTokenTrait(token, TRAIT.shape);
  let shape;

  switch (type) {
    case NFT_TYPE.Rough:
      shape = ROUGH_SHAPE[_.toUpper(shapeName)];
      switch (shape) {
        case ROUGH_SHAPE.MAKEABLE:
          return faGem;
        default:
          return null;
      }
    case NFT_TYPE.Cut:
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
    case NFT_TYPE.Polished:
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
    case NFT_TYPE.Burned:
      return faGem;
    case NFT_TYPE.Reborn:
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

  const tokenType = getTokenTrait(token, TRAIT.type);
  switch (systemStage) {
    case SYSTEM_STAGE.COMPLETE:
      return tokenType === NFT_TYPE.Burned;
    case SYSTEM_STAGE.SHIP:
      return tokenType === NFT_TYPE.Polished || tokenType === NFT_TYPE.Burned;
    default:
      const prevTokenType = getTypeByStage(systemStage - 1);
      return isTokenOfType(token, prevTokenType);
  }
};

export const isTokenDone = (token, systemStage) => {
  if (!token) return false;

  const tokenType = getTokenTrait(token, TRAIT.type);
  switch (systemStage) {
    case SYSTEM_STAGE.COMPLETE:
    case SYSTEM_STAGE.SHIP:
      return tokenType === NFT_TYPE.Reborn;
    default:
      const tokenStage = getStageByTokenType(tokenType);
      return tokenStage < systemStage - 1;
  }
};
