import { NO_SHAPE_NUM, ROUGH_SHAPE, SHAPE, SYSTEM_STAGE } from "consts";
import _ from "lodash";
import { getShapeName } from "utils";

// ADMIN CONTROL API
export const getSystemStageApi = async (contract) => {
  const [systemStage, isActive] = await Promise.all([
    contract.stage(),
    contract.isActive(),
  ]);
  return { systemStage, isActive };
};

export const getSystemPausedApi = async (contract) => {
  return await contract.paused();
};

export const getMaxDiamondsApi = async (contract) => {
  return await contract.maxDiamonds();
};

export const getMineDiamondCountApi = async (mineContract) => {
  return await mineContract.diamondCount();
};

export const setSystemStageApi = async (contract, systemStage) => {
  const tx = await contract.setStage(systemStage);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export const completeStageApi = async (contract, systemStage) => {
  const tx = await contract.completeStage(systemStage);
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
  [SYSTEM_STAGE.INVITE]: [NO_SHAPE_NUM],
  [SYSTEM_STAGE.MINE]: [ROUGH_SHAPE.MAKEABLE_1, ROUGH_SHAPE.MAKEABLE_2],
  [SYSTEM_STAGE.CUT]: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  [SYSTEM_STAGE.POLISH]: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  [SYSTEM_STAGE.SHIP]: [NO_SHAPE_NUM],
};

export const getVideoUrlsByStageApi = async (mineContract, stage) => {
  const shapes = ART_MAPPING[stage];
  const urls = await Promise.all(
    _.map(shapes, (shape) => mineContract["stageToShapeVideo"](stage, shape))
  );
  const names = _.map(shapes, (shape) => getShapeName(shape, stage));
  return _.zipObject(names, urls);
};

export const setVideoUrlsByStageApi = async (mineContract, stage, urls) => {
  const shapes = ART_MAPPING[stage];
  const shapeVideos = _.zipWith(shapes, urls, (shape, url) => ({
    shape: shape,
    video: url,
  }));
  const tx = await mineContract["setStageVideos"](stage, shapeVideos);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

// DIAMONDS API
const prepareDiamondForPopulate = (diamond) => ({
  ...diamond,
  points: parseInt(diamond.points),
  clarity: diamond.clarity,
  color: diamond.color,
  cut: diamond.cut,
  fluorescence: diamond.fluorescence,
  polish: diamond.polish,
  date: parseInt(diamond.date),
  number: parseInt(diamond.number),
  shape: diamond.shape,
  symmetry: diamond.symmetry,
});

export const eruptionApi = async (mineContract, diamonds) => {
  const processedDiamonds = diamonds.map(prepareDiamondForPopulate);

  console.log("PUSHING DIAMONDS TO MINE CONTRACT", {
    diamonds,
    processedDiamonds,
  });

  const tx = await mineContract.eruption(processedDiamonds);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

// Enter Mine API
export const allowMineEntranceApi = async (contract, passwordHashes) => {
  console.log("Pushing password hashes to contract", { passwordHashes });
  const tx = await contract.allowEntrance(passwordHashes);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};
