const { DIAMOND_DAWN_TYPE, NO_SHAPE_NUM } = require("./EnumConverterUtils");
const parseDataUrl = require("parse-data-url");
const { expect } = require("chai");

async function setVideoAndAssertEnterMineMetadata(
  mineContract,
  tokenId,
  videoSuffix,
  setSuffix
) {
  if (setSuffix) {
    await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ENTER_MINE, [
      { shape: NO_SHAPE_NUM, video: videoSuffix },
    ]);
  }
  const metadata = await mineContract.getDiamondMetadata(tokenId);
  const expectedMetadata = {
    name: `Diamond #${tokenId}`,
    description: "description",
    created_by: "dd",
    image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
    attributes: [{ trait_type: "Type", value: "Mine Entrance" }],
  };
  const parsedData = parseDataUrl(metadata); // parse data-url (data:[<mediatype>][;base64],<data>)
  // validate data-url format
  expect(parsedData.base64).to.be.true;
  expect(parsedData.mediaType).to.equal("application/json");
  expect(parsedData.contentType).to.equal("application/json");
  // validate actual data
  const parsedMetadata = JSON.parse(atob(parsedData.data));
  expect(parsedMetadata).to.deep.equal(expectedMetadata);
}

module.exports = {
  setVideoAndAssertEnterMineMetadata,
};
