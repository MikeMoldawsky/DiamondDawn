import _ from "lodash";
import { toast } from "react-toastify";
import { ROUGH_SHAPE, SHAPE, SYSTEM_STAGE, TRAIT } from "consts";
import { faGem } from "@fortawesome/free-solid-svg-icons";

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

  if (_.includes(message, "You can't enter the mine, you're not invited")) {
    return "You can't enter the mine, you're not invited";
  }

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

export const logApiError = (e, funcName) =>
  console.error(`Api Error - ${funcName} Failed`, e);

export const getEnumKeyByValue = (enm, value) => Object.keys(enm)[value];

export const getStageName = (stage) => getEnumKeyByValue(SYSTEM_STAGE, stage);

export const getTokenNextStageName = (token) => {
  if (!token) return SYSTEM_STAGE.MINE;

  return getStageName(token.stage + 1);
};

export const getTokenTrait = (token, trait) => {
  const t = _.find(token?.attributes, { trait_type: trait });
  return t?.value;
};

export const getDiamondIcon = (token) => {
  const shapeName = getTokenTrait(token, TRAIT.shape);
  let shape;

  switch (token.stage) {
    case SYSTEM_STAGE.KEY:
      return faGem;
    case SYSTEM_STAGE.MINE:
      shape = ROUGH_SHAPE[_.toUpper(_.snakeCase(shapeName))];
      switch (shape) {
        case ROUGH_SHAPE.MAKEABLE_1:
        case ROUGH_SHAPE.MAKEABLE_2:
          return faGem;
        default:
          return null;
      }
    case SYSTEM_STAGE.CUT:
      shape = SHAPE[_.toUpper(shapeName)];
      switch (shape) {
        case SHAPE.PEAR:
          return faGem;
        case SHAPE.ROUND:
          return faGem;
        case SHAPE.OVAL:
          return faGem;
        case SHAPE.CUSHION:
          return faGem;
        default:
          return null;
      }
    case SYSTEM_STAGE.POLISH:
      shape = SHAPE[_.toUpper(shapeName)];
      switch (shape) {
        case SHAPE.PEAR:
          return faGem;
        case SHAPE.ROUND:
          return faGem;
        case SHAPE.OVAL:
          return faGem;
        case SHAPE.CUSHION:
          return faGem;
        default:
          return null;
      }
    case SYSTEM_STAGE.DAWN:
      return faGem;
    default:
      return null;
  }
};

export const isTokenDone = (token, systemStage, isActive) => {
  if (!token) return false;

  const isNotProcessedEnough =
    token.stage < systemStage - 1 ||
    (token.stage === systemStage - 1 && !isActive);

  switch (systemStage) {
    case SYSTEM_STAGE.DAWN:
      return (
        (!token.isBurned && isNotProcessedEnough) ||
        token.stage === SYSTEM_STAGE.DAWN
      );
    default:
      return isNotProcessedEnough;
  }
};

export const isTokenActionable = (token, systemStage, isActive) => {
  if (!token || !isActive) return false;

  const isActionable = token.stage === systemStage - 1;

  if (systemStage === SYSTEM_STAGE.DAWN) {
    return isActionable && !token.isBurned;
  }

  return isActionable;
};

export const getActionableTokens = (tokens, systemStage, isActive) => {
  return _.filter(tokens, (token) =>
    isTokenActionable(token, systemStage, isActive)
  );
};

export const isNoContractMode = () =>
  process.env.REACT_APP_NO_CONTRACT === "true";

export const isPrivateSale = () =>
  process.env.REACT_APP_IS_PRIVATE_SALE === "true";

const prependBackslash = (objectPath) =>
  `${objectPath[0] !== "/" ? "/" : ""}${objectPath}`;

const getCDNObjectUrl = (objectPath) =>
  `${process.env.REACT_APP_CDN_URL}${prependBackslash(objectPath)}`;

export const getCDNNftUrl = (objectPath) =>
  getCDNObjectUrl(`/diamond-dawn-nft-mocks${prependBackslash(objectPath)}`);

export const getCDNImageUrl = (objectPath) =>
  getCDNObjectUrl(`/images${prependBackslash(objectPath)}`);

export const getCDNVideoUrl = (objectPath) =>
  getCDNObjectUrl(`/videos${prependBackslash(objectPath)}`);

export const getCDNAudioUrl = (objectPath) =>
  getCDNObjectUrl(`/audio${prependBackslash(objectPath)}`);

export const shortenEthAddress = (address) =>
  address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : "";

export const collectorDisplayName = (collector) =>
  collector
    ? collector.twitter ||
      // collector.email ||
      shortenEthAddress(collector.address)
    : "";

export const chainNameById = (chainId) => {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 5:
      return "Goerli Testnet";
    default:
      return "Local";
  }
};
