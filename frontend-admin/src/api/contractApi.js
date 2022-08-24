import { DIAMOND_DAWN_TYPE, ROUGH_SHAPE, SHAPE, SYSTEM_STAGE } from "consts";
import _ from "lodash";
import { getVideoUrlParamName } from "utils";
import { utils as ethersUtils } from "ethers";

// ADMIN CONTROL API
export const getSystemStageApi = async (contract) => {
  return await contract.systemStage();
};

export const getSystemPausedApi = async (contract) => {
  return await contract.paused();
};

export const getMineDiamondCountApi = async (mineContract) => {
  return await mineContract.getDiamondCount();
};

export const setSystemStageApi = async (contract, systemStage) => {
  const tx = await contract.setSystemStage(systemStage);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export const pauseApi = async (contract) => {
  const tx = await contract.pause();
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export const unpauseApi = async (contract) => {
  const tx = await contract.unpause();
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

// ART URLS API
const ART_MAPPING = {
  [SYSTEM_STAGE.INVITATIONS]: {
    setter: "setMineEntranceVideoUrl",
    getters: ["mineEntranceVideoUrl"],
    keys: [ROUGH_SHAPE.NO_SHAPE],
  },
  [SYSTEM_STAGE.MINE_OPEN]: {
    setter: "setRoughVideoUrl",
    getters: ["roughMakeableVideoUrl"],
    keys: [ROUGH_SHAPE.MAKEABLE],
  },
  [SYSTEM_STAGE.CUT_OPEN]: {
    setter: "setCutVideoUrls",
    getters: [
      "cutPearVideoUrl",
      "cutRoundVideoUrl",
      "cutOvalVideoUrl",
      "cutRadiantVideoUrl",
    ],
    keys: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  },
  [SYSTEM_STAGE.POLISH_OPEN]: {
    setter: "setPolishVideoUrls",
    getters: [
      "polishPearVideoUrl",
      "polishRoundVideoUrl",
      "polishOvalVideoUrl",
      "polishRadiantVideoUrl",
    ],
    keys: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  },
  [SYSTEM_STAGE.SHIP]: {
    setter: "setRebirthVideoUrl",
    getters: ["rebirthVideoUrl"],
    keys: [DIAMOND_DAWN_TYPE.REBORN],
  },
};

export const getVideoUrlsByStageApi = async (mineContract, stage) => {
  const { getters, keys } = ART_MAPPING[stage];
  const urls = await Promise.all(
    _.map(getters, (getter) => mineContract[getter]())
  );
  const names = _.map(keys, (key) => getVideoUrlParamName(key, stage));
  return _.zipObject(names, urls);
};

export const setVideoUrlsByStageApi = async (mineContract, stage, urls) => {
  const { setter } = ART_MAPPING[stage];
  const tx = await mineContract[setter](...urls);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

// DIAMONDS API
const prepareDiamondForPopulate = (diamond) => ({
  points: parseInt(diamond.points),
  clarity: diamond.clarity,
  color: diamond.color,
  cut: diamond.cut,
  fluorescence: diamond.fluorescence,
  polish: diamond.polish,
  reportDate: parseInt(diamond.reportDate),
  reportNumber: parseInt(diamond.reportNumber),
  measurements: diamond.measurements,
  shape: diamond.shape,
  symmetry: diamond.symmetry,
});

export const diamondEruptionApi = async (mineContract, diamonds) => {
  const processedDiamonds = diamonds.map(prepareDiamondForPopulate);

  console.log("PUSHING DIAMONDS TO MINE CONTRACT", {
    diamonds,
    processedDiamonds,
  });

  const tx = await mineContract.diamondEruption(processedDiamonds);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

// Enter Mine API
export const allowMineEntranceApi = async (contract, passwordHashes) => {
  console.log("Pushing password hashes to contract", { passwordHashes });
  const tx = await contract.allowMineEntrance(passwordHashes);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};
