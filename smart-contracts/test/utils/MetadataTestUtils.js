const parseDataUrl = require("parse-data-url");
const { expect } = require("chai");
const _ = require("lodash");
const {
  enumToClarity,
  enumToColor,
  enumToGrade,
  enumToFluorescence,
  enumToShape,
} = require("./EnumConverterUtils");

// constants
const MIN_ROUGH_EXTRA_POINTS = 37;
const MAX_ROUGH_EXTRA_POINTS = 74;
const MIN_POLISH_EXTRA_POINTS = 1;
const MAX_POLISH_EXTRA_POINTS = 4;
const BASE_URI =
  "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/";

async function setVideoAndAssertEnterMineMetadata(
  mineContract,
  tokenId,
  videoSuffix
) {
  const expectedMetadata = getExpectedMetadataEnterMine(tokenId, videoSuffix);
  const actualMetadata = await mineContract.getDiamondMetadata(tokenId);
  const actualParsedMetadata = await assertBase64AndGetParsed(actualMetadata);
  expect(actualParsedMetadata).to.deep.equal(expectedMetadata);
}

async function setVideoAndAssertRoughMetadata(
  mineContract,
  tokenId,
  points,
  videoSuffix1,
  videoSuffix2
) {
  const roughMetadataWithoutCaratShapeAndImage =
    getRoughMetadataWithoutCaratShapeAndImage(tokenId);
  const actualMetadata = await mineContract.getDiamondMetadata(tokenId);
  const actualParsedMetadata = await assertBase64AndGetParsed(actualMetadata);
  // Validate carat attribute
  const actualCaratAttributeList = _.remove(
    actualParsedMetadata.attributes,
    (currentObject) => currentObject.trait_type === "Carat"
  );
  expect(actualCaratAttributeList).to.satisfy((arr) => {
    expect(arr).to.have.lengthOf(1);
    const [actualCaratAttribute] = arr;
    expect(actualCaratAttribute).to.have.all.keys("trait_type", "value");
    expect(actualCaratAttribute.trait_type).equal("Carat");
    expect(actualCaratAttribute.value).to.be.within(
      (points + MIN_ROUGH_EXTRA_POINTS) / 100,
      (points + MAX_ROUGH_EXTRA_POINTS) / 100
    );
    return true;
  });
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
    if (actualShapeAttribute.value === "Makeable 1") {
      expect(actualParsedMetadata.image).to.be.equal(BASE_URI + videoSuffix1);
    } else if (actualShapeAttribute.value === "Makeable 2") {
      expect(actualParsedMetadata.image).to.be.equal(BASE_URI + videoSuffix2);
    } else {
      return false;
    }
    return true;
  });

  _.unset(actualParsedMetadata, "image");
  // Validate all attributes except carat, shape and image.
  expect(actualParsedMetadata).to.deep.equal(
    roughMetadataWithoutCaratShapeAndImage
  );
}

async function setVideoAndAssertCutMetadata(
  mineContract,
  tokenId,
  points,
  videoSuffix,
  diamond
) {
  const expectedMetadataWithoutCarat = getCutMetadataWithoutCarat(
    tokenId,
    videoSuffix,
    diamond
  );
  const actualMetadata = await mineContract.getDiamondMetadata(tokenId);
  const actualParsedMetadata = await assertBase64AndGetParsed(actualMetadata);
  // Validate carat attribute
  const actualCaratAttributeList = _.remove(
    actualParsedMetadata.attributes,
    (currentObject) => currentObject.trait_type === "Carat"
  );
  expect(actualCaratAttributeList).to.satisfy((arr) => {
    expect(arr).to.have.lengthOf(1);
    const [actualCaratAttribute] = arr;
    expect(actualCaratAttribute).to.have.all.keys("trait_type", "value");
    expect(actualCaratAttribute.trait_type).equal("Carat");
    expect(actualCaratAttribute.value).to.be.within(
      (points + MIN_POLISH_EXTRA_POINTS) / 100,
      (points + MAX_POLISH_EXTRA_POINTS) / 100
    );
    return true;
  });
  // Validate all attributes except carat
  expect(actualParsedMetadata).to.deep.equal(expectedMetadataWithoutCarat);
}

async function setVideoAndAssertPolishedMetadata(
  mineContract,
  tokenId,
  points,
  videoSuffix,
  diamond
) {
  const expectedMetadataWithoutCarat = getPolishedMetadataWithoutCarat(
    tokenId,
    videoSuffix,
    diamond
  );
  const actualMetadata = await mineContract.getDiamondMetadata(tokenId);
  const actualParsedMetadata = await assertBase64AndGetParsed(actualMetadata);
  // Validate carat attribute
  const actualCaratAttributeList = _.remove(
    actualParsedMetadata.attributes,
    (currentObject) => currentObject.trait_type === "Carat"
  );
  expect(actualCaratAttributeList).to.satisfy((arr) => {
    expect(arr).to.have.lengthOf(1);
    const [actualCaratAttribute] = arr;
    expect(actualCaratAttribute).to.have.all.keys("trait_type", "value");
    expect(actualCaratAttribute.trait_type).equal("Carat");
    expect(actualCaratAttribute.value).to.be.equal(points / 100);
    return true;
  });
  // Validate all attributes except carat
  expect(actualParsedMetadata).to.deep.equal(expectedMetadataWithoutCarat);
}

async function assertBase64AndGetParsed(actualMetadata) {
  const actualParsedUrlData = parseDataUrl(actualMetadata); // parse data-url (data:[<mediatype>][;base64],<data>)
  // validate data-url format
  expect(actualParsedUrlData.base64).to.be.true;
  expect(actualParsedUrlData.mediaType).to.equal("application/json");
  expect(actualParsedUrlData.contentType).to.equal("application/json");
  return JSON.parse(atob(actualParsedUrlData.data));
}

function getExpectedMetadataEnterMine(tokenId, videoSuffix) {
  return {
    name: `Diamond #${tokenId}`,
    description: "description",
    created_by: "dd",
    image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
    attributes: [{ trait_type: "Type", value: "Mine Entrance" }],
  };
}

function getRoughMetadataWithoutCaratShapeAndImage(tokenId) {
  return {
    name: `Diamond #${tokenId}`,
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

function getCutMetadataWithoutCarat(tokenId, videoSuffix, diamond) {
  return {
    name: `Diamond #${tokenId}`,
    description: "description",
    created_by: "dd",
    image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
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
      { trait_type: "Measurements", value: diamond.measurements },
      { trait_type: "Shape", value: enumToShape(diamond.shape) },
    ],
  };
}

function getPolishedMetadataWithoutCarat(tokenId, videoSuffix, diamond) {
  return {
    name: `Diamond #${tokenId}`,
    description: "description",
    created_by: "dd",
    image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
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
      { trait_type: "Measurements", value: diamond.measurements },
      { trait_type: "Shape", value: enumToShape(diamond.shape) },
      { trait_type: "Clarity", value: enumToClarity(diamond.clarity) },
      { trait_type: "Polish", value: enumToGrade(diamond.polish) },
      { trait_type: "Symmetry", value: enumToGrade(diamond.symmetry) },
    ],
  };
}

module.exports = {
  setVideoAndAssertEnterMineMetadata,
  setVideoAndAssertRoughMetadata,
  setVideoAndAssertCutMetadata,
  setVideoAndAssertPolishedMetadata,
};
