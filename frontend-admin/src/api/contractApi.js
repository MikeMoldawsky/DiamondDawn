import {
  DIAMOND_DAWN_TYPE,
  NO_SHAPE_NUM,
  ROUGH_SHAPE,
  SHAPE,
  SYSTEM_STAGE,
} from "consts";
import _ from "lodash";
import { getVideoUrlParamName } from "utils";

// ADMIN CONTROL API
export const getSystemStageApi = async (contract) => {
  const [systemStage, isStageActive] = await Promise.all([
    contract.stage(),
    contract.isStageActive(),
  ]);
  return { systemStage, isStageActive };
};

export const getSystemPausedApi = async (contract) => {
  return await contract.paused();
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
  [SYSTEM_STAGE.INVITATIONS]: {
    type: DIAMOND_DAWN_TYPE.ENTER_MINE,
    shapes: [NO_SHAPE_NUM],
  },
  [SYSTEM_STAGE.MINE_OPEN]: {
    type: DIAMOND_DAWN_TYPE.ROUGH,
    shapes: [ROUGH_SHAPE.MAKEABLE_1, ROUGH_SHAPE.MAKEABLE_2],
  },
  [SYSTEM_STAGE.CUT_OPEN]: {
    type: DIAMOND_DAWN_TYPE.CUT,
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  },
  [SYSTEM_STAGE.POLISH_OPEN]: {
    type: DIAMOND_DAWN_TYPE.POLISHED,
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  },
  [SYSTEM_STAGE.SHIP]: {
    type: DIAMOND_DAWN_TYPE.REBORN,
    shapes: [NO_SHAPE_NUM],
  },
};

export const getVideoUrlsByStageApi = async (mineContract, stage) => {
  const { type, shapes } = ART_MAPPING[stage];
  console.log("MIKE $$$$");
  console.log(mineContract);
  console.log({ type, shapes });
  const urls = await Promise.all(
    _.map(shapes, (shape) => mineContract["stageToShapeVideo"](type, shape))
  );
  const names = _.map(shapes, (shape) => getVideoUrlParamName(shape, stage));
  return _.zipObject(names, urls);
};

export const setVideoUrlsByStageApi = async (mineContract, stage, urls) => {
  const { type, shapes } = ART_MAPPING[stage];
  const shapeVideos = _.zipWith(shapes, urls, (shape, url) => ({
    shape: shape,
    video: url,
  }));
  const tx = await mineContract["setStageVideos"](type, shapeVideos);
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
  date: parseInt(diamond.date),
  number: parseInt(diamond.number),
  measurements: diamond.measurements,
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
