const parseDataUrl = require("parse-data-url");
const { expect } = require("chai");
const _ = require("lodash");
const {
  enumToClarity,
  enumToColor,
  enumToGrade,
  enumToFluorescence,
  enumToShape,
  STAGE,
} = require("./EnumConverterUtils");
const { DIAMOND, DIAMOND_TO_COLOR } = require("./Diamonds");

// constants from contract
const MIN_ROUGH_EXTRA_POINTS = 37;
const MAX_ROUGH_EXTRA_POINTS = 74;
const MIN_POLISH_EXTRA_POINTS = 1;
const MAX_POLISH_EXTRA_POINTS = 4;
const BASE_URI = "ar://";

// constants for tests
const KEY_MANIFEST = "key-manifest";
const MINE_MANIFEST = "mine-manifest";
const CUT_MANIFEST = "cut-manifest";
const POLISH_MANIFEST = "polish-manifest";
const REBORN_MANIFEST = "reborn-manifest";

async function setInviteManifest(mineContract) {
  await mineContract.setManifest(STAGE.KEY, KEY_MANIFEST);
}

async function setMineManifest(mineContract) {
  await mineContract.setManifest(STAGE.MINE, MINE_MANIFEST);
}

async function setCutManifest(mineContract) {
  await mineContract.setManifest(STAGE.CUT, CUT_MANIFEST);
}

async function setPolishManifest(mineContract) {
  await mineContract.setManifest(STAGE.POLISH, POLISH_MANIFEST);
}

async function setRebornManifest(mineContract) {
  await mineContract.setManifest(STAGE.DAWN, REBORN_MANIFEST);
}

async function setAllManifests(mineContract) {
  await setInviteManifest(mineContract);
  await setMineManifest(mineContract);
  await setCutManifest(mineContract);
  await setPolishManifest(mineContract);
  await setRebornManifest(mineContract);
}

async function populateDiamonds(mineContract, numDiamonds) {
  if (numDiamonds === 333) {
    await mineContract.eruption(
      _.range(150).flatMap((_) => [DIAMOND, DIAMOND_TO_COLOR])
    );
    await mineContract.eruption(
      _.range(16).flatMap((_) => [DIAMOND, DIAMOND_TO_COLOR])
    );
    await mineContract.eruption([DIAMOND]);
  } else {
    const numPairs = numDiamonds / 2;
    if (numPairs > 0) {
      await mineContract.eruption(
        _.range(numPairs).flatMap((_) => [DIAMOND, DIAMOND_TO_COLOR])
      );
    }
    if (numDiamonds % 2 === 1) {
      await mineContract.eruption([DIAMOND]);
    }
  }
}

async function prepareInviteReady(mineContract) {
  await setInviteManifest(mineContract);
}

async function prepareMineReady(mineContract, numDiamonds) {
  await prepareInviteReady(mineContract);
  await populateDiamonds(mineContract, numDiamonds);
  await setMineManifest(mineContract);
}

async function prepareCutReady(mineContract, numDiamonds) {
  await prepareMineReady(mineContract, numDiamonds);
  await setCutManifest(mineContract);
}

async function preparePolishReady(mineContract, numDiamonds) {
  await prepareCutReady(mineContract, numDiamonds);
  await setPolishManifest(mineContract);
}

async function prepareRebirthReady(mineContract, numDiamonds) {
  await preparePolishReady(mineContract, numDiamonds);
  await setRebornManifest(mineContract);
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
  const expectedMetadataNoCaratShapeImage =
    _getRoughMetadataNoCaratShapeAndURIs(numMined, totalMined);
  await _assertMetadataByType(
    expectedMetadataNoCaratShapeImage,
    ddUser,
    mineContract,
    tokenId,
    STAGE.MINE,
    diamond,
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
  const expectedMetadataNoCaratShapeImage = _getCutMetadataNoCaratShapeAndURIs(
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
    diamond,
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
    _getPolishedMetadataNoCaratShapeAndURIs(
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
    diamond,
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
    _getRebirthMetadataNoCaratShapeAndURIs(
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
    STAGE.DAWN,
    diamond,
    diamond.points
  );
}

async function _assertMetadataByType(
  expectedMetadataNoCaratShapeImage,
  ddUser,
  mineContract,
  tokenId,
  type,
  diamond,
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
    maxPoints,
    false
  );
  const noCaratShapeImageMetadata =
    await _validateAndRemoveShapeAndURIsMetadata(noCaratMetadata, type);
  const noCaratShapeImageRoughMetadata =
    await _validateAndRemoveRoughMetadataIfNeeded(
      noCaratShapeImageMetadata,
      type,
      diamond
    );
  const noCaratShapeImageRoughCutMetadata =
    await _validateAndRemoveCutMetadataIfNeeded(
      noCaratShapeImageRoughMetadata,
      type,
      diamond
    );
  expect(noCaratShapeImageRoughCutMetadata).to.deep.equal(
    expectedMetadataNoCaratShapeImage
  );
}

async function _validateAndRemoveCaratMetadata(
  parsedMetadata,
  minOrExactPoints,
  maxPoints,
  isRough,
  isCut
) {
  // Validate carat attribute
  const actualCaratAttributeList = _.remove(
    parsedMetadata.attributes,
    (currentObject) =>
      currentObject.trait_type ===
      (isRough ? "Carat Rough Stone" : isCut ? "Carat Pre Polish" : "Carat")
  );
  expect(actualCaratAttributeList).to.satisfy((arr) => {
    expect(arr).to.have.lengthOf(1);
    const [actualCaratAttribute] = arr;
    expect(actualCaratAttribute).to.have.all.keys("trait_type", "value");
    expect(actualCaratAttribute.trait_type).equal(
      isRough ? "Carat Rough Stone" : isCut ? "Carat Pre Polish" : "Carat"
    );
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

async function _validateAndRemoveRoughMetadataIfNeeded(
  actualParsedMetadata,
  type,
  diamond
) {
  switch (type) {
    case STAGE.KEY:
    case STAGE.MINE:
      return actualParsedMetadata;
  }
  // Validate Rough Color, Rough Shape, Rough Carat
  const actualRoughColorAttributeList = _.remove(
    actualParsedMetadata.attributes,
    (currentObject) => currentObject.trait_type === "Shape Rough Stone"
  );

  expect(actualRoughColorAttributeList).to.satisfy((arr) => {
    expect(arr).to.have.lengthOf(1);
    const [actualRoughShapeAttribute] = arr;
    expect(actualRoughShapeAttribute).to.have.all.keys("trait_type", "value");
    expect(actualRoughShapeAttribute.trait_type).equal("Shape Rough Stone");
    expect(actualRoughShapeAttribute.value).to.be.oneOf([
      "Makeable 1",
      "Makeable 2",
    ]);
    return true;
  });
  _.unset(actualParsedMetadata, "Shape Rough Stone");

  return await _validateAndRemoveCaratMetadata(
    actualParsedMetadata,
    diamond.points + MIN_ROUGH_EXTRA_POINTS,
    diamond.points + MAX_ROUGH_EXTRA_POINTS,
    true,
    false
  );
}

async function _validateAndRemoveCutMetadataIfNeeded(
  actualParsedMetadata,
  type,
  diamond
) {
  switch (type) {
    case STAGE.KEY:
    case STAGE.MINE:
    case STAGE.CUT:
      return actualParsedMetadata;
  }
  return await _validateAndRemoveCaratMetadata(
    actualParsedMetadata,
    diamond.points + MIN_POLISH_EXTRA_POINTS,
    diamond.points + MAX_POLISH_EXTRA_POINTS,
    false,
    true
  );
}

async function _validateAndRemoveShapeAndURIsMetadata(
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
    _assertURI(
      type,
      actualShapeAttribute.value,
      actualParsedMetadata.image,
      ".jpeg"
    );
    _assertURI(
      type,
      actualShapeAttribute.value,
      actualParsedMetadata.animation_url,
      ".mp4"
    );
    return true;
  });
  _.unset(actualParsedMetadata, "image");
  _.unset(actualParsedMetadata, "animation_url");
  return actualParsedMetadata;
}

function _assertURI(type, shape, image, suffix) {
  let manifest;
  let resource;
  switch (type) {
    case STAGE.MINE:
      manifest = MINE_MANIFEST;
      expect(shape).to.be.oneOf(["Makeable 1", "Makeable 2"]);
      switch (shape) {
        case "Makeable 1":
          resource = "makeable1";
          break;
        case "Makeable 2":
          resource = "makeable2";
          break;
        default:
          throw new Error("Unknown shape");
      }
      break;
    case STAGE.CUT:
      manifest = CUT_MANIFEST;
      expect(shape).to.be.oneOf(["Pear", "Round", "Oval", "Cushion"]);
      switch (shape) {
        case "Pear":
          resource = "pear";
          break;
        case "Round":
          resource = "round";
          break;
        case "Oval":
          resource = "oval";
          break;
        case "Cushion":
          resource = "cushion";
          break;
        default:
          throw new Error("Unknown shape");
      }
      break;
    case STAGE.POLISH:
      manifest = POLISH_MANIFEST;
      expect(shape).to.be.oneOf(["Pear", "Round", "Oval", "Cushion"]);
      switch (shape) {
        case "Pear":
          resource = "pear";
          break;
        case "Round":
          resource = "round";
          break;
        case "Oval":
          resource = "oval";
          break;
        case "Cushion":
          resource = "cushion";
          break;
        default:
          throw new Error("Unknown shape");
      }
      break;
    case STAGE.DAWN:
      manifest = REBORN_MANIFEST;
      expect(shape).to.be.oneOf(["Pear", "Round", "Oval", "Cushion"]);
      resource = "resource";
      break;
    default:
      throw new Error("Unknown type");
  }
  expect(image).to.be.equal(`${BASE_URI}${manifest}/${resource}${suffix}`);
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
    image: `${BASE_URI}${KEY_MANIFEST}/resource.jpeg`,
    animation_url: `${BASE_URI}${KEY_MANIFEST}/resource.mp4`,
    attributes: [
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Type", value: "Key" },
      { trait_type: "Metal", value: "Gold" },
    ],
  };
}

function _getRoughMetadataNoCaratShapeAndURIs(numMined, totalMined) {
  return {
    name: `Rough Stone #${numMined}`,
    attributes: [
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Type", value: "Diamond" },
      { trait_type: "Stage", value: "Rough" },
      { trait_type: "Identification", value: "Natural" },
      {
        display_type: "number",
        max_value: totalMined,
        trait_type: "Mined",
        value: numMined,
      },
      { trait_type: "Color", value: "Cape" },
    ],
  };
}

function _getCutMetadataNoCaratShapeAndURIs(
  diamond,
  numMined,
  totalMined,
  numCut,
  totalCut
) {
  const isRound = enumToShape(diamond.shape) === "Round";
  const separator = isRound ? " - " : " x ";
  const measurements =
    _.padEnd((diamond.length / 100).toString(), 4, "0") +
    separator +
    _.padEnd((diamond.width / 100).toString(), 4, "0") +
    " x " +
    _.padEnd((diamond.depth / 100).toString(), 4, "0");
  const res = {
    name: `Formation #${numCut}`,
    attributes: [
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Type", value: "Diamond" },
      { trait_type: "Stage", value: "Cut" },
      { trait_type: "Identification", value: "Natural" },
      {
        display_type: "number",
        max_value: totalMined,
        trait_type: "Mined",
        value: numMined,
      },
      { trait_type: "Color Rough Stone", value: "Cape" },
      { trait_type: "Color", value: _expectedColor(diamond) },
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
  if (!isRound) _.pullAt(res.attributes, [7]);
  return res;
}

function _getPolishedMetadataNoCaratShapeAndURIs(
  diamond,
  numMined,
  totalMined,
  numCut,
  totalCut,
  numPolished,
  totalPolished
) {
  const isRound = enumToShape(diamond.shape) === "Round";
  const separator = isRound ? " - " : " x ";
  const measurements =
    _.padEnd((diamond.length / 100).toString(), 4, "0") +
    separator +
    _.padEnd((diamond.width / 100).toString(), 4, "0") +
    " x " +
    _.padEnd((diamond.depth / 100).toString(), 4, "0");
  const res = {
    name: `Diamond #${numPolished}`,
    attributes: [
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Type", value: "Diamond" },
      { trait_type: "Stage", value: "Polished" },
      { trait_type: "Identification", value: "Natural" },
      {
        display_type: "number",
        max_value: totalMined,
        trait_type: "Mined",
        value: numMined,
      },
      { trait_type: "Color Rough Stone", value: "Cape" },
      { trait_type: "Color", value: _expectedColor(diamond) },
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
  if (!isRound) _.pullAt(res.attributes, [7]);
  return res;
}

function _getRebirthMetadataNoCaratShapeAndURIs(
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
  const isRound = enumToShape(diamond.shape) === "Round";
  const separator = isRound ? " - " : " x ";
  const measurements =
    _.padEnd((diamond.length / 100).toString(), 4, "0") +
    separator +
    _.padEnd((diamond.width / 100).toString(), 4, "0") +
    " x " +
    _.padEnd((diamond.depth / 100).toString(), 4, "0");
  const res = {
    name: `Dawn #${numPhysical}`,
    attributes: [
      { trait_type: "Origin", value: "Metaverse" },
      { trait_type: "Type", value: "Certificate" },
      { trait_type: "Stage", value: "Reborn" },
      { trait_type: "Identification", value: "Natural" },
      {
        display_type: "number",
        max_value: totalMined,
        trait_type: "Mined",
        value: numMined,
      },
      { trait_type: "Color Rough Stone", value: "Cape" },
      { trait_type: "Color", value: _expectedColor(diamond) },
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
  if (!isRound) _.pullAt(res.attributes, [7]);
  return res;
}

function _expectedColor(diamond) {
  return diamond.toColor === 0
    ? enumToColor(diamond.color)
    : `${enumToColor(diamond.color)}-${enumToColor(diamond.toColor)}`;
}

module.exports = {
  BASE_URI,
  KEY_MANIFEST,
  MINE_MANIFEST,
  CUT_MANIFEST,
  POLISH_MANIFEST,
  REBORN_MANIFEST,
  assertBase64AndGetParsed,
  assertEnterMineMetadata,
  assertRoughMetadata,
  assertCutMetadata,
  assertPolishedMetadata,
  assertRebornMetadata,
  setAllManifests,
  setInviteManifest,
  setMineManifest,
  setCutManifest,
  setPolishManifest,
  setRebornManifest,
  populateDiamonds,
  prepareInviteReady,
  prepareMineReady,
  prepareCutReady,
  preparePolishReady,
  prepareRebirthReady,
};
