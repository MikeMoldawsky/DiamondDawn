import { NO_SHAPE_NUM, ROUGH_SHAPE, SHAPE, SYSTEM_STAGE } from "consts";
import _ from "lodash";
import { getShapeName, getSystemStageName } from "utils";

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

export const getStageManifestApi = async (mineContract, stage) => {
  const url = await mineContract["manifests"](stage);
  return _.zipObject([getSystemStageName(stage)], [url]);
};

export const setStageManifestApi = async (mineContract, stage, url) => {
  const tx = await mineContract["setManifest"](stage, url);
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
