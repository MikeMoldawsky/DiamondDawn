const parseDataUrl = require("parse-data-url");
const { expect } = require("chai");
const _ = require("lodash");
const {
  enumToClarity,
  enumToColor,
  enumToGrade,
  enumToFluorescence,
  enumToShape,
  NO_SHAPE_NUM,
  ROUGH_SHAPE,
  SHAPE,
  STAGE,
} = require("./EnumConverterUtils");
const { DIAMOND } = require("./Diamonds");

// constants from contract
const MIN_ROUGH_EXTRA_POINTS = 37;
const MAX_ROUGH_EXTRA_POINTS = 74;
const MIN_POLISH_EXTRA_POINTS = 1;
const MAX_POLISH_EXTRA_POINTS = 4;
const BASE_URI = "https://arweave.net/"; // TODO: change to ar://

// constants for tests
const ENTER_MINE_VIDEO = "enterMine.mp4";

const MAKEABLE_1_VIDEO = "makeable1.mp4";
const MAKEABLE_2_VIDEO = "makeable2.mp4";

const CUT_PEAR_VIDEO = "cutPear.mp4";
const CUT_ROUND_VIDEO = "cutRound.mp4";
const CUT_OVAL_VIDEO = "cutOval.mp4";
const CUT_CUSHION_VIDEO = "cutCushion.mp4";

const POLISHED_PEAR_VIDEO = "polishedPear.mp4";
const POLISHED_ROUND_VIDEO = "polishedRound.mp4";
const POLISHED_OVAL_VIDEO = "polishedOval.mp4";
const POLISHED_CUSHION_VIDEO = "polishedCushion.mp4";

const REBORN_VIDEO = "reborn.mp4";

async function setEnterMineVideo(mineContract) {
  await mineContract.setStageVideos(STAGE.INVITE, [
    { shape: NO_SHAPE_NUM, video: ENTER_MINE_VIDEO },
  ]);
}

async function setRoughVideos(mineContract) {
  await mineContract.setStageVideos(STAGE.MINE, [
    { shape: ROUGH_SHAPE.MAKEABLE_1, video: MAKEABLE_1_VIDEO },
    { shape: ROUGH_SHAPE.MAKEABLE_2, video: MAKEABLE_2_VIDEO },
  ]);
}

async function setCutVideos(mineContract) {
  await mineContract.setStageVideos(STAGE.CUT, [
    { shape: SHAPE.PEAR, video: CUT_PEAR_VIDEO },
    { shape: SHAPE.ROUND, video: CUT_ROUND_VIDEO },
    { shape: SHAPE.OVAL, video: CUT_OVAL_VIDEO },
    { shape: SHAPE.CUSHION, video: CUT_CUSHION_VIDEO },
  ]);
}

async function setPolishedVideos(mineContract) {
  await mineContract.setStageVideos(STAGE.POLISH, [
    { shape: SHAPE.PEAR, video: POLISHED_PEAR_VIDEO },
    { shape: SHAPE.ROUND, video: POLISHED_ROUND_VIDEO },
    { shape: SHAPE.OVAL, video: POLISHED_OVAL_VIDEO },
    { shape: SHAPE.CUSHION, video: POLISHED_CUSHION_VIDEO },
  ]);
}

async function setRebornVideo(mineContract) {
  await mineContract.setStageVideos(STAGE.SHIP, [
    { shape: NO_SHAPE_NUM, video: REBORN_VIDEO },
  ]);
}

async function setAllVideoUrls(mineContract) {
  await setEnterMineVideo(mineContract);
  await setRoughVideos(mineContract);
  await setCutVideos(mineContract);
  await setPolishedVideos(mineContract);
  await setRebornVideo(mineContract);
}

async function populateDiamonds(mineContract, numDiamonds) {
  if (numDiamonds === 333) {
    await mineContract.eruption(_.range(300).map((_) => DIAMOND));
    await mineContract.eruption(_.range(33).map((_) => DIAMOND));
  } else {
    await mineContract.eruption(_.range(numDiamonds).map((_) => DIAMOND));
  }
}

async function prepareMineEntranceReady(mineContract) {
  await setEnterMineVideo(mineContract);
}

async function prepareMineReady(mineContract, numDiamonds) {
  await prepareMineEntranceReady(mineContract);
  await populateDiamonds(mineContract, numDiamonds);
  await setRoughVideos(mineContract);
}

async function prepareCutReady(mineContract, numDiamonds) {
  await prepareMineReady(mineContract, numDiamonds);
  await setCutVideos(mineContract);
}

async function preparePolishReady(mineContract, numDiamonds) {
  await prepareCutReady(mineContract, numDiamonds);
  await setPolishedVideos(mineContract);
}

async function prepareRebirthReady(mineContract, numDiamonds) {
  await preparePolishReady(mineContract, numDiamonds);
  await setRebornVideo(mineContract);
}

async function assertEnterMineMetadata(ddUser, mineContract, tokenId) {
  const expectedMetadata = _getExpectedMetadataEnterMine(tokenId);
  const parsedMetadata = await _getParsedMetadata(
    ddUser,
    mineContract,
    tokenId
  );
  expect(parsedMetadata).to.deep.equal(expectedMetadata);
}

async function assertRoughMetadata(
  ddUser,
  mineContract,
  diamond,
  tokenId,
  numMined,
  totalMined
) {
  const expectedMetadataNoCaratShapeImage = _getRoughMetadataNoCaratShapeImage(
    numMined,
    totalMined
  );
  await _assertMetadataByType(
    expectedMetadataNoCaratShapeImage,
    ddUser,
    mineContract,
    tokenId,
    STAGE.MINE,
    diamond.points + MIN_ROUGH_EXTRA_POINTS,
    diamond.points + MAX_ROUGH_EXTRA_POINTS
  );
}

async function assertCutMetadata(
  ddUser,
  mineContract,
  diamond,
  tokenId,
  numMined,
  totalMined,
  numCut,
  totalCut
) {
  const expectedMetadataNoCaratShapeImage = _getCutMetadataNoCaratShapeImage(
    diamond,
    numMined,
    totalMined,
    numCut,
    totalCut
  );
  await _assertMetadataByType(
    expectedMetadataNoCaratShapeImage,
    ddUser,
    mineContract,
    tokenId,
    STAGE.CUT,
    diamond.points + MIN_POLISH_EXTRA_POINTS,
    diamond.points + MAX_POLISH_EXTRA_POINTS
  );
}

async function assertPolishedMetadata(
  ddUser,
  mineContract,
  diamond,
  tokenId,
  numMined,
  totalMined,
  numCut,
  totalCut,
  numPolished,
  totalPolished
) {
  const expectedMetadataNoCaratShapeImage =
    _getPolishedMetadataNoCaratShapeImage(
      diamond,
      numMined,
      totalMined,
      numCut,
      totalCut,
      numPolished,
      totalPolished
    );
  await _assertMetadataByType(
    expectedMetadataNoCaratShapeImage,
    ddUser,
    mineContract,
    tokenId,
    STAGE.POLISH,
    diamond.points
  );
}

async function assertRebornMetadata(
  ddUser,
  mineContract,
  diamond,
  tokenId,
  numMined,
  totalMined,
  numCut,
  totalCut,
  numPolished,
  totalPolished,
  numPhysical,
  totalPhysical
) {
  const expectedMetadataNoCaratShapeImage =
    _getRebirthMetadataNoCaratShapeAndImage(
      diamond,
      numMined,
      totalMined,
      numCut,
      totalCut,
      numPolished,
      totalPolished,
      numPhysical,
      totalPhysical
    );
  await _assertMetadataByType(
    expectedMetadataNoCaratShapeImage,
    ddUser,
    mineContract,
    tokenId,
    STAGE.SHIP,
    diamond.points
  );
}

async function _assertMetadataByType(
  expectedMetadataNoCaratShapeImage,
  ddUser,
  mineContract,
  tokenId,
  type,
  minOrExactPoints,
  maxPoints
) {
  const parsedMetadata = await _getParsedMetadata(
    ddUser,
    mineContract,
    tokenId
  );
  const noCaratMetadata = await _validateAndRemoveCaratMetadata(
    parsedMetadata,
    minOrExactPoints,
    maxPoints
  );
  const noCaratShapeImageMetadata =
    await _validateAndRemoveShapeAndImageMetadata(noCaratMetadata, type);
  expect(noCaratShapeImageMetadata).to.deep.equal(
    expectedMetadataNoCaratShapeImage
  );
}

async function _validateAndRemoveCaratMetadata(
  parsedMetadata,
  minOrExactPoints,
  maxPoints
) {
  // Validate carat attribute
  const actualCaratAttributeList = _.remove(
    parsedMetadata.attributes,
    (currentObject) => currentObject.trait_type === "Carat"
  );
  expect(actualCaratAttributeList).to.satisfy((arr) => {
    expect(arr).to.have.lengthOf(1);
    const [actualCaratAttribute] = arr;
    expect(actualCaratAttribute).to.have.all.keys("trait_type", "value");
    expect(actualCaratAttribute.trait_type).equal("Carat");
    if (maxPoints) {
      expect(actualCaratAttribute.value).to.be.within(
        minOrExactPoints / 100,
        maxPoints / 100
      );
    } else {
      expect(actualCaratAttribute.value).to.equal(minOrExactPoints / 100);
    }
    return true;
  });
  return parsedMetadata;
}

async function _validateAndRemoveShapeAndImageMetadata(
  actualParsedMetadata,
  type
) {
  // Validate Shape and Image
  const actualShapeAttributeList = _.remove(
    actualParsedMetadata.attributes,
    (currentObject) => currentObject.trait_type === "Shape"
  );

  expect(actualShapeAttributeList).to.satisfy((arr) => {
    expect(arr).to.have.lengthOf(1);
    const [actualShapeAttribute] = arr;
    expect(actualShapeAttribute).to.have.all.keys("trait_type", "value");
    expect(actualShapeAttribute.trait_type).equal("Shape");
    _assertShapeImage(
      type,
      actualShapeAttribute.value,
      actualParsedMetadata.image
    );
    return true;
  });
  _.unset(actualParsedMetadata, "image");
  return actualParsedMetadata;
}

function _assertShapeImage(type, shape, image) {
  let video;
  switch (type) {
    case STAGE.MINE:
      expect(shape).to.be.oneOf(["Makeable 1", "Makeable 2"]);
      switch (shape) {
        case "Makeable 1":
          video = MAKEABLE_1_VIDEO;
          break;
        case "Makeable 2":
          video = MAKEABLE_2_VIDEO;
          break;
        default:
          throw new Error("Unknown shape");
      }
      break;
    case STAGE.CUT:
      expect(shape).to.be.oneOf(["Pear", "Round", "Oval", "Cushion"]);
      switch (shape) {
        case "Pear":
          video = CUT_PEAR_VIDEO;
          break;
        case "Round":
          video = CUT_ROUND_VIDEO;
          break;
        case "Oval":
          video = CUT_OVAL_VIDEO;
          break;
        case "Cushion":
          video = CUT_CUSHION_VIDEO;
          break;
        default:
          throw new Error("Unknown shape");
      }
      break;
    case STAGE.POLISH:
      expect(shape).to.be.oneOf(["Pear", "Round", "Oval", "Cushion"]);
      switch (shape) {
        case "Pear":
          video = POLISHED_PEAR_VIDEO;
          break;
        case "Round":
          video = POLISHED_ROUND_VIDEO;
          break;
        case "Oval":
          video = POLISHED_OVAL_VIDEO;
          break;
        case "Cushion":
          video = POLISHED_CUSHION_VIDEO;
          break;
        default:
          throw new Error("Unknown shape");
      }
      break;
    case STAGE.SHIP:
      expect(shape).to.be.oneOf(["Pear", "Round", "Oval", "Cushion"]);
      video = REBORN_VIDEO;
      break;
    default:
      throw new Error("Unknown type");
  }
  expect(image).to.be.equal(`${BASE_URI}${video}`);
}

async function _getParsedMetadata(ddUser, mineContract, tokenId) {
  const actualMetadata = await mineContract
    .connect(ddUser)
    .getMetadata(tokenId);
  return await assertBase64AndGetParsed(actualMetadata);
}

async function assertBase64AndGetParsed(actualMetadata) {
  const actualParsedUrlData = parseDataUrl(actualMetadata); // parse data-url (data:[<mediatype>][;base64],<data>)
  // validate data-url format
  expect(actualParsedUrlData.base64).to.be.true;
  expect(actualParsedUrlData.mediaType).to.equal("application/json");
  expect(actualParsedUrlData.contentType).to.equal("application/json");
  return JSON.parse(atob(actualParsedUrlData.data));
}

function _getExpectedMetadataEnterMine(tokenId) {
  return {
    name: `Mine Key #${tokenId}`,
    description: "description",
    created_by: "dd",
    image: `${BASE_URI}${ENTER_MINE_VIDEO}`,
    attributes: [{ trait_type: "Type", value: "Key" }],
  };
}

function _getRoughMetadataNoCaratShapeImage(numMined, totalMined) {
  return {
    name: `Rough Stone #${numMined}`,
    description: "description",
    created_by: "dd",
    attributes: [
      { trait_type: "Type", value: "Rough" },
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Identification", value: "Natural" },
      {
        display_type: "number",
        max_value: totalMined,
        trait_type: "Mined",
        value: numMined,
      },
      { trait_type: "Color", value: "Cape" },
      { trait_type: "Mine", value: "Underground" },
    ],
  };
}

function _getCutMetadataNoCaratShapeImage(
  diamond,
  numMined,
  totalMined,
  numCut,
  totalCut
) {
  const separator = enumToShape(diamond.shape) === "Round" ? " - " : " x ";
  const measurements =
    _.padEnd((diamond.length / 100).toString(), 4, "0") +
    separator +
    _.padEnd((diamond.width / 100).toString(), 4, "0") +
    " x " +
    _.padEnd((diamond.depth / 100).toString(), 4, "0");
  return {
    name: `Formation #${numCut}`,
    description: "description",
    created_by: "dd",
    attributes: [
      { trait_type: "Type", value: "Cut" },
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Identification", value: "Natural" },
      {
        display_type: "number",
        max_value: totalMined,
        trait_type: "Mined",
        value: numMined,
      },
      { trait_type: "Color", value: enumToColor(diamond.color) },
      { trait_type: "Cut", value: enumToGrade(diamond.cut) },
      {
        trait_type: "Fluorescence",
        value: enumToFluorescence(diamond.fluorescence),
      },
      {
        trait_type: "Measurements",
        value: measurements,
      },
      {
        display_type: "number",
        max_value: totalCut,
        trait_type: "Cut",
        value: numCut,
      },
    ],
  };
}

function _getPolishedMetadataNoCaratShapeImage(
  diamond,
  numMined,
  totalMined,
  numCut,
  totalCut,
  numPolished,
  totalPolished
) {
  const separator = enumToShape(diamond.shape) === "Round" ? " - " : " x ";
  const measurements =
    _.padEnd((diamond.length / 100).toString(), 4, "0") +
    separator +
    _.padEnd((diamond.width / 100).toString(), 4, "0") +
    " x " +
    _.padEnd((diamond.depth / 100).toString(), 4, "0");
  return {
    name: `Diamond #${numPolished}`,
    description: "description",
    created_by: "dd",
    attributes: [
      { trait_type: "Type", value: "Polished" },
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Identification", value: "Natural" },
      {
        display_type: "number",
        max_value: totalMined,
        trait_type: "Mined",
        value: numMined,
      },
      { trait_type: "Color", value: enumToColor(diamond.color) },
      { trait_type: "Cut", value: enumToGrade(diamond.cut) },
      {
        trait_type: "Fluorescence",
        value: enumToFluorescence(diamond.fluorescence),
      },
      { trait_type: "Measurements", value: measurements },
      {
        display_type: "number",
        max_value: totalCut,
        trait_type: "Cut",
        value: numCut,
      },
      { trait_type: "Clarity", value: enumToClarity(diamond.clarity) },
      { trait_type: "Polish", value: enumToGrade(diamond.polish) },
      { trait_type: "Symmetry", value: enumToGrade(diamond.symmetry) },
      {
        display_type: "number",
        max_value: totalPolished,
        trait_type: "Polished",
        value: numPolished,
      },
    ],
  };
}

function _getRebirthMetadataNoCaratShapeAndImage(
  diamond,
  numMined,
  totalMined,
  numCut,
  totalCut,
  numPolished,
  totalPolished,
  numPhysical,
  totalPhysical
) {
  const separator = enumToShape(diamond.shape) === "Round" ? " - " : " x ";
  const measurements =
    _.padEnd((diamond.length / 100).toString(), 4, "0") +
    separator +
    _.padEnd((diamond.width / 100).toString(), 4, "0") +
    " x " +
    _.padEnd((diamond.depth / 100).toString(), 4, "0");

  return {
    name: `Dawn #${numPhysical}`,
    description: "description",
    created_by: "dd",
    attributes: [
      { trait_type: "Type", value: "Reborn" },
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Identification", value: "Natural" },
      {
        display_type: "number",
        max_value: totalMined,
        trait_type: "Mined",
        value: numMined,
      },
      { trait_type: "Color", value: enumToColor(diamond.color) },
      { trait_type: "Cut", value: enumToGrade(diamond.cut) },
      {
        trait_type: "Fluorescence",
        value: enumToFluorescence(diamond.fluorescence),
      },
      { trait_type: "Measurements", value: measurements },
      {
        display_type: "number",
        max_value: totalCut,
        trait_type: "Cut",
        value: numCut,
      },
      { trait_type: "Clarity", value: enumToClarity(diamond.clarity) },
      { trait_type: "Polish", value: enumToGrade(diamond.polish) },
      { trait_type: "Symmetry", value: enumToGrade(diamond.symmetry) },
      {
        display_type: "number",
        max_value: totalPolished,
        trait_type: "Polished",
        value: numPolished,
      },
      { trait_type: "Laboratory", value: "GIA" },
      { trait_type: "Report Date", value: diamond.date, display_type: "date" },
      { trait_type: "Report Number", value: diamond.number },
      {
        display_type: "number",
        max_value: totalPhysical,
        trait_type: "Physical",
        value: numPhysical,
      },
    ],
  };
}

module.exports = {
  BASE_URI,
  assertBase64AndGetParsed,
  assertEnterMineMetadata,
  assertRoughMetadata,
  assertCutMetadata,
  assertPolishedMetadata,
  assertRebornMetadata,
  setAllVideoUrls,
  setEnterMineVideo,
  setRoughVideos,
  setCutVideos,
  setPolishedVideos,
  setRebornVideo,
  populateDiamonds,
  prepareMineEntranceReady,
  prepareMineReady,
  prepareCutReady,
  preparePolishReady,
  prepareRebirthReady,
};
