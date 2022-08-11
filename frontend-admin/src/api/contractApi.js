import { DIAMOND_DAWN_TYPE, ROUGH_SHAPE, SHAPE, SYSTEM_STAGE } from "consts";
import _ from "lodash";
import { getShapeName, getVideoUrlParamName } from "utils";

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
  [SYSTEM_STAGE.MINE_OPEN]: {
    setter: "setRoughVideoUrl",
    getter: "roughShapeToVideoUrls",
    getterArgs: [ROUGH_SHAPE.MAKEABLE],
  },
  [SYSTEM_STAGE.CUT_OPEN]: {
    setter: "setCutVideoUrl",
    getter: "cutShapeToVideoUrls",
    getterArgs: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  },
  [SYSTEM_STAGE.POLISH_OPEN]: {
    setter: "setPolishVideoUrl",
    getter: "polishShapeToVideoUrls",
    getterArgs: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  },
  [SYSTEM_STAGE.SHIP]: {
    setter: "setShipVideoUrls",
    getter: "diamondDawnTypeToShipVideoUrls",
    getterArgs: [DIAMOND_DAWN_TYPE.BURNED, DIAMOND_DAWN_TYPE.REBORN],
  },
};

export const getVideoUrlsByStageApi = async (mineContract, stage) => {
  const { getter, getterArgs } = ART_MAPPING[stage];
  const urls = await Promise.all(
    _.map(getterArgs, (getterArg) => mineContract[getter](getterArg))
  );
  const getterParamNames = _.map(getterArgs, (getterArg) =>
    getVideoUrlParamName(getterArg, stage)
  );
  return _.zipObject(getterParamNames, urls);
};

export const setVideoUrlsByStageApi = async (mineContract, stage, urls) => {
  const { setter } = ART_MAPPING[stage];
  const tx = await mineContract[setter](...urls);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

// DIAMONDS API
const prepareDiamondForPopulate = (diamond) => ({
  points: parseInt((parseFloat(diamond.carat.$numberDecimal) * 100).toString()),
  clarity: diamond.clarity,
  color: diamond.color,
  cut: diamond.cut,
  depth: diamond.depth.$numberDecimal,
  fluorescence: diamond.fluorescence,
  length: diamond.length.$numberDecimal,
  polish: diamond.polish,
  reportDate: parseInt(diamond.reportDate),
  reportNumber: parseInt(diamond.reportNumber),
  shape: diamond.shape,
  symmetry: diamond.symmetry,
  width: diamond.width.$numberDecimal,
});

export const populateDiamondsApi = async (mineContract, diamonds) => {
  const processedDiamonds = diamonds.map(prepareDiamondForPopulate);

  console.log("PUSHING DIAMONDS TO MINE CONTRACT", {
    diamonds,
    processedDiamonds,
  });

  const tx = await mineContract.populateDiamonds(processedDiamonds);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};
