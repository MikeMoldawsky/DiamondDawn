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
const { DIAMOND } = require("./Diamonds");

// constants from contract
const MIN_ROUGH_EXTRA_POINTS = 37;
const MAX_ROUGH_EXTRA_POINTS = 74;
const MIN_POLISH_EXTRA_POINTS = 1;
const MAX_POLISH_EXTRA_POINTS = 4;
const BASE_URI = "ar://";

// constants for tests
const INVITE_MANIFEST = "invite-manifest";
const MINE_MANIFEST = "mine-manifest";
const CUT_MANIFEST = "cut-manifest";
const POLISH_MANIFEST = "polish-manifest";
const REBORN_MANIFEST = "reborn-manifest";

async function setInviteManifest(mineContract) {
  await mineContract.setManifest(STAGE.INVITE, INVITE_MANIFEST);
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
  await mineContract.setManifest(STAGE.SHIP, REBORN_MANIFEST);
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
    await mineContract.eruption(_.range(300).map((_) => DIAMOND));
    await mineContract.eruption(_.range(33).map((_) => DIAMOND));
  } else {
    await mineContract.eruption(_.range(numDiamonds).map((_) => DIAMOND));
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
    await _validateAndRemoveShapeAndURIsMetadata(noCaratMetadata, type);
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
    case STAGE.SHIP:
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
    description: "description",
    created_by: "dd",
    image: `${BASE_URI}${INVITE_MANIFEST}/resource.jpeg`,
    animation_url: `${BASE_URI}${INVITE_MANIFEST}/resource.mp4`,
    attributes: [{ trait_type: "Type", value: "Key" }],
  };
}

function _getRoughMetadataNoCaratShapeAndURIs(numMined, totalMined) {
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

function _getCutMetadataNoCaratShapeAndURIs(
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

function _getPolishedMetadataNoCaratShapeAndURIs(
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
  INVITE_MANIFEST,
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
