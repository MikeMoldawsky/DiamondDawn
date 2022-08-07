// ADMIN CONTROL API
import {ROUGH_SHAPE, SHAPE, STAGE} from "consts";
import _ from "lodash";
import {getShapeName} from "utils";

export const completeCurrentStageAndRevealNextStage = async (contract) => {
  const tx = await contract.completeCurrentStageAndRevealNextStage();
  const receipt = await tx.wait();
  return receipt.transactionHash
};

export const pause = async (contract) => {
  const tx = await contract.pause();
  const receipt = await tx.wait();
  return receipt.transactionHash
};

export const unpause = async (contract) => {
  const tx = await contract.unpause();
  const receipt = await tx.wait();
  return receipt.transactionHash
};

// ART URLS API
const ART_MAPPING = {
  [STAGE.MINE]: {
    shapes: [ROUGH_SHAPE.MAKEABLE],
    setter: "setRoughVideoUrl",
    getter: "roughShapeToVideoUrls",
  },
  [STAGE.CUT]: {
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
    setter: "setCutVideoUrl",
    getter: "cutShapeToVideoUrls",
  },
  [STAGE.POLISH]: {
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
    setter: "setPolishVideoUrl",
    getter: "polishShapeToVideoUrls",
  },
  [STAGE.BURN]: {
    shapes: [undefined],
    setter: "setBurnVideoUrl",
    getter: "burnVideoUrl",
  },
  [STAGE.REBIRTH]: {
    shapes: [undefined],
    setter: "setRebirthVideoUrl",
    getter: "rebirthVideoUrl",
  },
};

export const getStageVideoUrls = async (mineContract, stage) => {
  const { shapes, getter } = ART_MAPPING[stage]
  const urls = await Promise.all(
    _.map(shapes, (shape) => {
      if (shape !== undefined) {
        return mineContract[getter](shape);
      } else {
        return mineContract[getter]();
      }
    })
  );

  const shapeNames = _.map(shapes, shape => getShapeName(shape, stage))
  return _.zipObject(shapeNames, urls)
}

export const setStageVideoUrls = async (mineContract, stage, urls) => {
  const { setter } = ART_MAPPING[stage]
  const tx = await mineContract[setter](...urls);
  const receipt = await tx.wait();
  return receipt.transactionHash
}

// DIAMONDS API
const prepareDiamondForPopulate = diamond => ({
  points: parseInt(
    (parseFloat(diamond.carat.$numberDecimal) * 100).toString()
  ),
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
})

export const populateDiamonds = async (mineContract, diamonds) => {
  const processedDiamonds = diamonds.map(prepareDiamondForPopulate)

  console.log("PUSHING DIAMONDS TO MINE CONTRACT", { diamonds, processedDiamonds });

  const tx = await mineContract.populateDiamonds(processedDiamonds);
  const receipt = await tx.wait();
  return receipt.transactionHash
}