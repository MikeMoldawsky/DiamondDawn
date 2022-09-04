const parseDataUrl = require("parse-data-url");
const { expect } = require("chai");
const _ = require("lodash");
const {
  enumToClarity,
  enumToColor,
  enumToGrade,
  enumToFluorescence,
  enumToShape,
  DIAMOND_DAWN_TYPE,
  NO_SHAPE_NUM,
  ROUGH_SHAPE,
  SHAPE,
} = require("./EnumConverterUtils");
const { DIAMOND } = require("./Diamonds");

// constants from contract
const MIN_ROUGH_EXTRA_POINTS = 37;
const MAX_ROUGH_EXTRA_POINTS = 74;
const MIN_POLISH_EXTRA_POINTS = 1;
const MAX_POLISH_EXTRA_POINTS = 4;
const BASE_URI =
  "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks";

// constants for tests
const ENTER_MINE_VIDEO = "enterMine.mp4";

const MAKEABLE_1_VIDEO = "makeable1.mp4";
const MAKEABLE_2_VIDEO = "makeable2.mp4";

const CUT_PEAR_VIDEO = "cutPear.mp4";
const CUT_ROUND_VIDEO = "cutRound.mp4";
const CUT_OVAL_VIDEO = "cutOval.mp4";
const CUT_RADIANT_VIDEO = "cutRadiant.mp4";

const POLISHED_PEAR_VIDEO = "polishedPear.mp4";
const POLISHED_ROUND_VIDEO = "polishedRound.mp4";
const POLISHED_OVAL_VIDEO = "polishedOval.mp4";
const POLISHED_RADIANT_VIDEO = "polishedRadiant.mp4";

const REBORN_VIDEO = "reborn.mp4";

async function setEnterMineVideo(mineContract) {
  await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ENTER_MINE, [
    { shape: NO_SHAPE_NUM, video: ENTER_MINE_VIDEO },
  ]);
}

async function setRoughVideos(mineContract) {
  await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ROUGH, [
    { shape: ROUGH_SHAPE.MAKEABLE_1, video: MAKEABLE_1_VIDEO },
    { shape: ROUGH_SHAPE.MAKEABLE_2, video: MAKEABLE_2_VIDEO },
  ]);
}

async function setCutVideos(mineContract) {
  await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.CUT, [
    { shape: SHAPE.PEAR, video: CUT_PEAR_VIDEO },
    { shape: SHAPE.ROUND, video: CUT_ROUND_VIDEO },
    { shape: SHAPE.OVAL, video: CUT_OVAL_VIDEO },
    { shape: SHAPE.RADIANT, video: CUT_RADIANT_VIDEO },
  ]);
}

async function setPolishedVideos(mineContract) {
  await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.POLISHED, [
    { shape: SHAPE.PEAR, video: POLISHED_PEAR_VIDEO },
    { shape: SHAPE.ROUND, video: POLISHED_ROUND_VIDEO },
    { shape: SHAPE.OVAL, video: POLISHED_OVAL_VIDEO },
    { shape: SHAPE.RADIANT, video: POLISHED_RADIANT_VIDEO },
  ]);
}

async function setRebornVideo(mineContract) {
  await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.REBORN, [
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
  const diamonds = _.range(numDiamonds).map((_) => DIAMOND);
  await mineContract.eruption(diamonds);
}

async function prepareMineEntranceReady(mineContract) {
  await setEnterMineVideo(mineContract);
}

async function prepareRoughReady(mineContract, numDiamonds) {
  await prepareMineEntranceReady(mineContract);
  await populateDiamonds(mineContract, numDiamonds);
  await setRoughVideos(mineContract);
}

async function prepareCutReady(mineContract, numDiamonds) {
  await prepareRoughReady(mineContract, numDiamonds);
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

async function assertEnterMineMetadata(mineContract, tokenId) {
  const expectedMetadata = _getExpectedMetadataEnterMine(tokenId);
  const parsedMetadata = await _getParsedMetadata(mineContract, tokenId);
  expect(parsedMetadata).to.deep.equal(expectedMetadata);
}

async function assertRoughMetadata(mineContract, tokenId, roughId, diamond) {
  const expectedMetadataNoCaratShapeImage =
    _getRoughMetadataNoCaratShapeImage(roughId);
  await _assertMetadataByType(
    expectedMetadataNoCaratShapeImage,
    mineContract,
    tokenId,
    DIAMOND_DAWN_TYPE.ROUGH,
    diamond.points + MIN_ROUGH_EXTRA_POINTS,
    diamond.points + MAX_ROUGH_EXTRA_POINTS
  );
}

async function assertCutMetadata(mineContract, tokenId, cutId, diamond) {
  const expectedMetadataNoCaratShapeImage = _getCutMetadataNoCaratShapeImage(
    cutId,
    diamond
  );
  await _assertMetadataByType(
    expectedMetadataNoCaratShapeImage,
    mineContract,
    tokenId,
    DIAMOND_DAWN_TYPE.CUT,
    diamond.points + MIN_POLISH_EXTRA_POINTS,
    diamond.points + MAX_POLISH_EXTRA_POINTS
  );
}

async function assertPolishedMetadata(
  mineContract,
  tokenId,
  polishedId,
  diamond
) {
  const expectedMetadataNoCaratShapeImage =
    _getPolishedMetadataNoCaratShapeImage(polishedId, diamond);
  await _assertMetadataByType(
    expectedMetadataNoCaratShapeImage,
    mineContract,
    tokenId,
    DIAMOND_DAWN_TYPE.POLISHED,
    diamond.points
  );
}

async function assertRebornMetadata(mineContract, tokenId, rebornId, diamond) {
  const expectedMetadataNoCaratShapeImage =
    _getRebirthMetadataNoCaratShapeAndImage(rebornId, diamond);
  await _assertMetadataByType(
    expectedMetadataNoCaratShapeImage,
    mineContract,
    tokenId,
    DIAMOND_DAWN_TYPE.REBORN,
    diamond.points
  );
}

async function _assertMetadataByType(
  expectedMetadataNoCaratShapeImage,
  mineContract,
  tokenId,
  type,
  minOrExactPoints,
  maxPoints
) {
  const parsedMetadata = await _getParsedMetadata(mineContract, tokenId);
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
    case DIAMOND_DAWN_TYPE.ROUGH:
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
    case DIAMOND_DAWN_TYPE.CUT:
      expect(shape).to.be.oneOf(["Pear", "Round", "Oval", "Radiant"]);
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
        case "Radiant":
          video = CUT_RADIANT_VIDEO;
          break;
        default:
          throw new Error("Unknown shape");
      }
      break;
    case DIAMOND_DAWN_TYPE.POLISHED:
      expect(shape).to.be.oneOf(["Pear", "Round", "Oval", "Radiant"]);
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
        case "Radiant":
          video = POLISHED_RADIANT_VIDEO;
          break;
        default:
          throw new Error("Unknown shape");
      }
      break;
    case DIAMOND_DAWN_TYPE.REBORN:
      expect(shape).to.be.oneOf(["Pear", "Round", "Oval", "Radiant"]);
      video = REBORN_VIDEO;
      break;
    default:
      throw new Error("Unknown type");
  }
  expect(image).to.be.equal(`${BASE_URI}/${video}`);
}

async function _getParsedMetadata(mineContract, tokenId) {
  const actualMetadata = await mineContract.getMetadata(tokenId);
  return await _assertBase64AndGetParsed(actualMetadata);
}

async function _assertBase64AndGetParsed(actualMetadata) {
  const actualParsedUrlData = parseDataUrl(actualMetadata); // parse data-url (data:[<mediatype>][;base64],<data>)
  // validate data-url format
  expect(actualParsedUrlData.base64).to.be.true;
  expect(actualParsedUrlData.mediaType).to.equal("application/json");
  expect(actualParsedUrlData.contentType).to.equal("application/json");
  return JSON.parse(atob(actualParsedUrlData.data));
}

function _getExpectedMetadataEnterMine(tokenId) {
  return {
    name: `Mine Entrance #${tokenId}`,
    description: "description",
    created_by: "dd",
    image: `${BASE_URI}/${ENTER_MINE_VIDEO}`,
    attributes: [{ trait_type: "Type", value: "Mine Entrance" }],
  };
}

function _getRoughMetadataNoCaratShapeImage(id) {
  return {
    name: `Rough Diamond #${id}`,
    description: "description",
    created_by: "dd",
    attributes: [
      { trait_type: "Type", value: "Rough" },
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Identification", value: "Natural" },
      { trait_type: "Color", value: "Cape" },
      { trait_type: "Mine", value: "Underground" },
    ],
  };
}

function _getCutMetadataNoCaratShapeImage(id, diamond) {
  const separator = enumToShape(diamond.shape) === "Round" ? " - " : " x ";
  const measurements =
    _.padEnd((diamond.length / 100).toString(), 4, "0") +
    separator +
    _.padEnd((diamond.width / 100).toString(), 4, "0") +
    " x " +
    _.padEnd((diamond.depth / 100).toString(), 4, "0");
  return {
    name: `Cut Diamond #${id}`,
    description: "description",
    created_by: "dd",
    attributes: [
      { trait_type: "Type", value: "Cut" },
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Identification", value: "Natural" },
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
    ],
  };
}

function _getPolishedMetadataNoCaratShapeImage(id, diamond) {
  const separator = enumToShape(diamond.shape) === "Round" ? " - " : " x ";
  const measurements =
    _.padEnd((diamond.length / 100).toString(), 4, "0") +
    separator +
    _.padEnd((diamond.width / 100).toString(), 4, "0") +
    " x " +
    _.padEnd((diamond.depth / 100).toString(), 4, "0");
  return {
    name: `Polished Diamond #${id}`,
    description: "description",
    created_by: "dd",
    attributes: [
      { trait_type: "Type", value: "Polished" },
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Identification", value: "Natural" },
      { trait_type: "Color", value: enumToColor(diamond.color) },
      { trait_type: "Cut", value: enumToGrade(diamond.cut) },
      {
        trait_type: "Fluorescence",
        value: enumToFluorescence(diamond.fluorescence),
      },
      { trait_type: "Measurements", value: measurements },
      { trait_type: "Clarity", value: enumToClarity(diamond.clarity) },
      { trait_type: "Polish", value: enumToGrade(diamond.polish) },
      { trait_type: "Symmetry", value: enumToGrade(diamond.symmetry) },
    ],
  };
}

function _getRebirthMetadataNoCaratShapeAndImage(id, diamond) {
  const separator = enumToShape(diamond.shape) === "Round" ? " - " : " x ";
  const measurements =
    _.padEnd((diamond.length / 100).toString(), 4, "0") +
    separator +
    _.padEnd((diamond.width / 100).toString(), 4, "0") +
    " x " +
    _.padEnd((diamond.depth / 100).toString(), 4, "0");

  return {
    name: `Diamond Dawn #${id}`,
    description: "description",
    created_by: "dd",
    attributes: [
      { trait_type: "Type", value: "Reborn" },
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Identification", value: "Natural" },
      { trait_type: "Color", value: enumToColor(diamond.color) },
      { trait_type: "Cut", value: enumToGrade(diamond.cut) },
      {
        trait_type: "Fluorescence",
        value: enumToFluorescence(diamond.fluorescence),
      },
      { trait_type: "Measurements", value: measurements },
      { trait_type: "Clarity", value: enumToClarity(diamond.clarity) },
      { trait_type: "Polish", value: enumToGrade(diamond.polish) },
      { trait_type: "Symmetry", value: enumToGrade(diamond.symmetry) },
      { trait_type: "Laboratory", value: "GIA" },
      { trait_type: "Report Date", value: diamond.date, display_type: "date" },
      { trait_type: "Report Number", value: diamond.number },
      { trait_type: "Physical Id", value: id },
    ],
  };
}

module.exports = {
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
  prepareRoughReady,
  prepareCutReady,
  preparePolishReady,
  prepareRebirthReady,
};
