import { ROUGH_SHAPE, SHAPE, SYSTEM_STAGE } from "consts";
import _ from "lodash";
import { getShapeName } from "utils";

// ADMIN CONTROL API
export const getSystemStageApi = async (contract) => {
  return await contract.systemStage()
}

export const getSystemPausedApi = async (contract) => {
  return await contract.paused()
}

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
    shapes: [ROUGH_SHAPE.MAKEABLE],
    setter: "setRoughVideoUrl",
    getter: "roughShapeToVideoUrls",
  },
  [SYSTEM_STAGE.CUT_OPEN]: {
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
    setter: "setCutVideoUrl",
    getter: "cutShapeToVideoUrls",
  },
  [SYSTEM_STAGE.POLISH_OPEN]: {
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
    setter: "setPolishVideoUrl",
    getter: "polishShapeToVideoUrls",
  },
  [SYSTEM_STAGE.SHIP]: {
    shapes: [undefined],
    setter: "setBurnVideoUrl",
    getter: "burnVideoUrl",
  },
  [SYSTEM_STAGE.COMPLETE]: {
    shapes: [undefined],
    setter: "setRebirthVideoUrl",
    getter: "rebirthVideoUrl",
  },
};

export const getStageVideoUrls = async (mineContract, stage) => {
  const { shapes, getter } = ART_MAPPING[stage];
  const urls = await Promise.all(
    _.map(shapes, (shape) => {
      if (shape !== undefined) {
        return mineContract[getter](shape);
      } else {
        return mineContract[getter]();
      }
    })
  );

  const shapeNames = _.map(shapes, (shape) => getShapeName(shape, stage));
  return _.zipObject(shapeNames, urls);
};

export const setStageVideoUrls = async (mineContract, stage, urls) => {
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

export const populateDiamonds = async (mineContract, diamonds) => {
  const processedDiamonds = diamonds.map(prepareDiamondForPopulate);

  console.log("PUSHING DIAMONDS TO MINE CONTRACT", {
    diamonds,
    processedDiamonds,
  });

  const tx = await mineContract.populateDiamonds(processedDiamonds);
  const receipt = await tx.wait();
  return receipt.transactionHash;
};
