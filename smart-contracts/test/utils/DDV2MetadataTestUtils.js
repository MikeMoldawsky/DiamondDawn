const parseDataUrl = require("parse-data-url");
const { expect } = require("chai");

// constants from contract
const BASE_URI = "ar://";

// constants for tests
const KEY_MANIFEST = "key-manifest";
const MINE_MANIFEST = "mine-manifest";
const CUT_MANIFEST = "cut-manifest";
const POLISH_MANIFEST = "polish-manifest";
const REBORN_MANIFEST = "reborn-manifest";

async function assertRevealMetadata(ddUser, ddContract, tokenId) {
  const expectedMetadata = _getExpectedMetadataEnterMine(tokenId);
  const parsedMetadata = await getParsedMetadata(ddUser, ddContract, tokenId);
  expect(parsedMetadata).to.deep.equal(expectedMetadata);
}

async function getParsedMetadata(ddUser, ddContract, tokenId) {
  const actualMetadata = await ddContract.connect(ddUser).tokenURI(tokenId);
  return await assertBase64AndGetParsed(actualMetadata);
}

async function assertBase64AndGetParsed(actualMetadata) {
  console.log(">>>>> MIKE 1", { actualMetadata });
  const actualParsedUrlData = parseDataUrl(actualMetadata); // parse data-url (data:[<mediatype>][;base64],<data>)
  // validate data-url format
  console.log(">>>>> MIKE 2", { actualParsedUrlData });
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

module.exports = {
  BASE_URI,
  KEY_MANIFEST,
  MINE_MANIFEST,
  CUT_MANIFEST,
  POLISH_MANIFEST,
  REBORN_MANIFEST,
  assertBase64AndGetParsed,
  assertRevealMetadata,
  getParsedMetadata,
};
