import { toast } from "react-toastify";
import { SYSTEM_STAGE } from "consts";
import get from "lodash/get";
import includes from "lodash/includes";
import find from "lodash/find";
import filter from "lodash/filter";
import split from "lodash/split";
import isEmpty from "lodash/isEmpty";
import intervalToDuration from "date-fns/intervalToDuration";

export const parseError = (e) => {
  if (e.response?.data) return e.response.data;
  let message = get(e, "error.data.message", "");
  if (!message) {
    message = get(e, "error.message", "");
  }
  if (!message) {
    message = get(e, "message", "");
    try {
      const startJson = message.indexOf("{");
      const endJson = message.lastIndexOf("}") + 1;
      const sub = message.substr(startJson, endJson - startJson);
      message = JSON.parse(sub);
      message = get(message, "value.data.message");
    } catch (err) {
      // do nothing
    }
  }
  if (!message) return "Unknown error";

  if (includes(message, "You can't enter the mine, you're not invited")) {
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
  toast.error(errorMessage, {
    draggable: false,
    theme: "dark",
  });
  console.error(errorMessage);
};

export const logApiError = (e, funcName) =>
  console.error(`Api Error - ${funcName} Failed`, e);

export const getEnumKeyByValue = (enm, value) => Object.keys(enm)[value];

export const getStageName = (stage) => getEnumKeyByValue(SYSTEM_STAGE, stage);

export const getTokenNextStageName = (token) => {
  if (!token) return SYSTEM_STAGE.MINE;

  return getStageName(token.stage + 1);
};

export const getTokenTrait = (token, trait) => {
  const t = find(token?.attributes, { trait_type: trait });
  return t?.value;
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
  return filter(tokens, (token) =>
    isTokenActionable(token, systemStage, isActive)
  );
};

export const isNoContractMode = () =>
  process.env.REACT_APP_NO_CONTRACT === "true";

export const isInviteOnly = () =>
  process.env.REACT_APP_IS_INVITE_ONLY === "true";

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

export const getCDNContractUrl = (objectPath) =>
  getCDNObjectUrl(`/contracts${prependBackslash(objectPath)}`);

export const createVideoSources = (fileName) => [
  { src: getCDNVideoUrl(`${fileName}.webm`), type: "video/webm" },
  { src: getCDNVideoUrl(`${fileName}.mp4`), type: "video/mp4" },
];
export const getVideoBitrate = (width) => {
  return width <= 1024 ? "2.5m" : "5m";
  // return width <= 768 || (width <= 1024 && height > width);
};
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

export const safeParseInt = (v) => {
  try {
    return parseInt(v);
  } catch (e) {
    console.error("safeParseInt threw", e);
    return -1;
  }
};

const isCountryInList = (list) => (countryCode) => {
  const blockedCountries = split(list, ",");

  return !isEmpty(blockedCountries) && includes(blockedCountries, countryCode);
};

export const isBlockedCountry = isCountryInList(
  process.env.REACT_APP_BLOCKED_COUNTRIES
);

export const isVATCountry = isCountryInList(process.env.REACT_APP_VAT_COUNTRY);

export const calcTokensMinted = (tokensMinted, config) => {
  const MINUTES = 5;
  const { mintOpenTime, offset } = config;
  const mintOpenDate = new Date(mintOpenTime);
  const now = new Date();
  if (offset > 0 && mintOpenTime) {
    const duration = intervalToDuration({
      start: mintOpenDate,
      end: now,
    });

    if (duration.minutes > MINUTES) {
      return tokensMinted;
    }
    const calculatedOffset =
      offset - Math.floor((offset * duration.minutes) / MINUTES);

    const output = tokensMinted - calculatedOffset;
    console.log("calcConfigOffset", {
      config,
      duration,
      calculatedOffset,
      tokensMinted,
      output,
    });

    return output >= 0 ? output : 0;
  }

  return tokensMinted;
};
