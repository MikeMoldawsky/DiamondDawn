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
    getter: "mineEntranceVideoUrl",
    getterArgs: [ROUGH_SHAPE.NO_SHAPE],
    isNotMap: true,
  },
  [SYSTEM_STAGE.MINE_OPEN]: {
    setter: "setRoughVideoUrl",
    getter: "roughShapeToVideoUrls",
    getterArgs: [ROUGH_SHAPE.MAKEABLE],
  },
  [SYSTEM_STAGE.CUT_OPEN]: {
    setter: "setCutVideoUrls",
    getter: "cutShapeToVideoUrls",
    getterArgs: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  },
  [SYSTEM_STAGE.POLISH_OPEN]: {
    setter: "setPolishVideoUrls",
    getter: "polishShapeToVideoUrls",
    getterArgs: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
  },
  [SYSTEM_STAGE.SHIP]: {
    setter: "setRebirthVideoUrl",
    getter: "diamondDawnTypeToShipVideoUrls",
    getterArgs: [DIAMOND_DAWN_TYPE.REBORN],
  },
};

export const getVideoUrlsByStageApi = async (mineContract, stage) => {
  const { getter, getterArgs, isNotMap } = ART_MAPPING[stage];
  const urls = await Promise.all(
    _.map(getterArgs, (getterArg) =>
      isNotMap ? mineContract[getter]() : mineContract[getter](getterArg)
    )
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

// Enter Mine API
export const toPasswordHash = (password) => {
  // password must be string type, not number.
  const packed = ethersUtils.solidityPack(["string"], [password]);
  return ethersUtils.keccak256(packed);
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

export const allowMineEntranceApi = async (contract, passwords) => {
  const passwordHashes = passwords.map(toPasswordHash);
  console.log("Pushing password hashes to contract", { passwordHashes });

  const tx = await contract.allowMineEntrance(passwordHashes);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};
