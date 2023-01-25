const parseDataUrl = require("parse-data-url");
const { expect } = require("chai");
const { BASE_URI, MINT_MANIFEST } = require("./ConstsV2");

async function assertMintMetadata(ddUser, ddContract, tokenId, isHonorary) {
  const expectedMetadata = _getExpectedMetadataMint(tokenId, isHonorary);
  const parsedMetadata = await getParsedMetadata(ddUser, ddContract, tokenId);
  expect(parsedMetadata).to.deep.equal(expectedMetadata);
}

async function getParsedMetadata(ddUser, ddContract, tokenId) {
  const actualMetadata = await ddContract.connect(ddUser).tokenURI(tokenId);
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

function _getExpectedMetadataMint(tokenId, isHonorary) {
  return {
    name: `Diamond Dawn #${tokenId}`,
    image: `${BASE_URI}${MINT_MANIFEST}/${
      isHonorary ? "logo-honorary.jpeg" : "logo.jpeg"
    }`,
    animation_url: `${BASE_URI}${MINT_MANIFEST}/${
      isHonorary ? "logo-honorary.mp4" : "logo.mp4"
    }`,
    attributes: isHonorary
      ? [{ trait_type: "Attribute", value: "Honorary" }]
      : [],
  };
}

module.exports = {
  assertBase64AndGetParsed,
  assertMintMetadata,
  getParsedMetadata,
};
