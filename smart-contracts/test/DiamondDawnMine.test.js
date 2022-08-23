require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const parseDataUrl = require("parse-data-url");
const _ = require("lodash");
const {
  enumToColor,
  enumToGrade,
  enumToFluorescence,
  enumToShape,
  enumToClarity,
} = require("./constants/consts");

// constants
const MIN_ROUGH_EXTRA_POINTS = 38;
const MAX_ROUGH_EXTRA_POINTS = 74;
const MIN_POLISH_EXTRA_POINTS = 1;
const MAX_POLISH_EXTRA_POINTS = 4;

const DIAMOND = {
  reportNumber: 1111111111,
  reportDate: 1659254421,
  shape: 1,
  points: 45,
  color: 2,
  clarity: 1,
  cut: 1,
  polish: 1,
  symmetry: 1,
  fluorescence: 1,
  measurements: "5.1 - 5.12 x 35",
};

describe("Diamond Dawn Mine", () => {
  async function deployDiamondDawnMineContractsFixture() {
    const [owner, user1, user2, user3, user4, user5, user6, user7, user8] =
      await ethers.getSigners();
    const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine");
    const diamondDawnMine = await DiamondDawnMine.deploy([]);
    await diamondDawnMine.deployed();
    await diamondDawnMine.initialize(owner.address);
    return {
      diamondDawnMine,
      owner,
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
    };
  }

  describe("Metadata", function () {
    it("is reverted when token doesn't exist", async () => {
      const { diamondDawnMine } = await loadFixture(
        deployDiamondDawnMineContractsFixture
      );
      await expect(diamondDawnMine.getDiamondMetadata(1)).to.be.revertedWith(
        "No token"
      );
    });

    it("is correct for enterMine", async () => {
      const { diamondDawnMine } = await loadFixture(
        deployDiamondDawnMineContractsFixture
      );
      const videoSuffix = "suffix.mp4";
      const expectedMetadata = {
        name: "Diamond #1",
        description: "description",
        created_by: "dd",
        image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
        attributes: [{ trait_type: "Type", value: "Mine Entrance" }],
      };
      // Token 1 enters mine
      const tokenId = 1;
      await diamondDawnMine.enterMine(tokenId);
      await diamondDawnMine.setMineEntranceVideoUrl(videoSuffix);
      // fetch metadata for token 1
      const metadata = await diamondDawnMine.getDiamondMetadata(tokenId);
      const parsedData = parseDataUrl(metadata); // parse data-url (data:[<mediatype>][;base64],<data>)
      // validate data-url format
      expect(parsedData.base64).to.be.true;
      expect(parsedData.mediaType).to.equal("application/json");
      expect(parsedData.contentType).to.equal("application/json");
      // validate actual data
      const parsedMetadata = JSON.parse(atob(parsedData.data));
      expect(parsedMetadata).to.deep.equal(expectedMetadata);
    });

    it("is correct for mine", async () => {
      const { diamondDawnMine } = await loadFixture(
        deployDiamondDawnMineContractsFixture
      );
      const videoSuffix = "suffix.mp4";
      const expectedMetadataWithoutCarat = {
        name: "Diamond #1",
        description: "description",
        created_by: "dd",
        image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
        attributes: [
          { trait_type: "Origin", value: "Metaverse" },
          { trait_type: "Type", value: "Rough" },
          { trait_type: "Identification", value: "Natural" },
          { trait_type: "Color", value: "Cape" },
          { trait_type: "Shape", value: "Makeable" },
          { trait_type: "Mine", value: "Underground" },
        ],
      };

      await diamondDawnMine.setRoughVideoUrl(videoSuffix);
      await diamondDawnMine.diamondEruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await diamondDawnMine.enterMine(tokenId);
      await diamondDawnMine.mine(tokenId);

      // fetch metadata for token 1
      const actualMetadata = await diamondDawnMine.getDiamondMetadata(tokenId);
      const actualParsedUrlData = parseDataUrl(actualMetadata); // parse data-url (data:[<mediatype>][;base64],<data>)
      // validate data-url format
      expect(actualParsedUrlData.base64).to.be.true;
      expect(actualParsedUrlData.mediaType).to.equal("application/json");
      expect(actualParsedUrlData.contentType).to.equal("application/json");
      // validate actual data
      const actualParsedMetadata = JSON.parse(atob(actualParsedUrlData.data));
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
          (DIAMOND.points + MIN_ROUGH_EXTRA_POINTS) / 100,
          (DIAMOND.points + MAX_ROUGH_EXTRA_POINTS) / 100
        );
        return true;
      });
      // Validate all attributes except carat
      expect(actualParsedMetadata).to.deep.equal(expectedMetadataWithoutCarat);
    });

    it("is correct for cut", async () => {
      const { diamondDawnMine } = await loadFixture(
        deployDiamondDawnMineContractsFixture
      );
      const videoSuffix = "suffix.mp4";
      const expectedMetadataWithoutCarat = {
        name: "Diamond #1",
        description: "description",
        created_by: "dd",
        image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
        attributes: [
          { trait_type: "Origin", value: "Metaverse" },
          { trait_type: "Type", value: "Cut" },
          { trait_type: "Identification", value: "Natural" },
          { trait_type: "Color", value: enumToColor(DIAMOND.color) },
          { trait_type: "Cut", value: enumToGrade(DIAMOND.cut) },
          {
            trait_type: "Fluorescence",
            value: enumToFluorescence(DIAMOND.fluorescence),
          },
          { trait_type: "Measurements", value: DIAMOND.measurements },
          { trait_type: "Shape", value: enumToShape(DIAMOND.shape) },
        ],
      };
      await diamondDawnMine.setCutVideoUrls(videoSuffix, "", "", ""); // TODO: test all urls
      await diamondDawnMine.diamondEruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await diamondDawnMine.enterMine(tokenId);
      await diamondDawnMine.mine(tokenId);
      await diamondDawnMine.cut(tokenId);

      // fetch metadata for token 1
      const actualMetadata = await diamondDawnMine.getDiamondMetadata(tokenId);
      const actualParsedUrlData = parseDataUrl(actualMetadata); // parse data-url (data:[<mediatype>][;base64],<data>)
      // validate data-url format
      expect(actualParsedUrlData.base64).to.be.true;
      expect(actualParsedUrlData.mediaType).to.equal("application/json");
      expect(actualParsedUrlData.contentType).to.equal("application/json");
      // validate actual data
      const actualParsedMetadata = JSON.parse(atob(actualParsedUrlData.data));
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
          (DIAMOND.points + MIN_POLISH_EXTRA_POINTS) / 100,
          (DIAMOND.points + MAX_POLISH_EXTRA_POINTS) / 100
        );
        return true;
      });
      // Validate all attributes except carat
      expect(actualParsedMetadata).to.deep.equal(expectedMetadataWithoutCarat);
    });

    it("is correct for polish", async () => {
      const { diamondDawnMine } = await loadFixture(
        deployDiamondDawnMineContractsFixture
      );
      const videoSuffix = "suffix.mp4";
      const expectedMetadataWithoutCarat = {
        name: "Diamond #1",
        description: "description",
        created_by: "dd",
        image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
        attributes: [
          { trait_type: "Origin", value: "Metaverse" },
          { trait_type: "Type", value: "Polished" },
          { trait_type: "Identification", value: "Natural" },
          { trait_type: "Color", value: enumToColor(DIAMOND.color) },
          { trait_type: "Cut", value: enumToGrade(DIAMOND.cut) },
          {
            trait_type: "Fluorescence",
            value: enumToFluorescence(DIAMOND.fluorescence),
          },
          { trait_type: "Measurements", value: DIAMOND.measurements },
          { trait_type: "Shape", value: enumToShape(DIAMOND.shape) },
          { trait_type: "Clarity", value: enumToClarity(DIAMOND.clarity) },
          { trait_type: "Polish", value: enumToGrade(DIAMOND.polish) },
          { trait_type: "Symmetry", value: enumToGrade(DIAMOND.symmetry) },
        ],
      };

      await diamondDawnMine.setPolishVideoUrls(videoSuffix, "", "", ""); // TODO: test all urls
      await diamondDawnMine.diamondEruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await diamondDawnMine.enterMine(tokenId);
      await diamondDawnMine.mine(tokenId);
      await diamondDawnMine.cut(tokenId);
      await diamondDawnMine.polish(tokenId);

      // fetch metadata for token 1
      const actualMetadata = await diamondDawnMine.getDiamondMetadata(tokenId);
      const actualParsedUrlData = parseDataUrl(actualMetadata); // parse data-url (data:[<mediatype>][;base64],<data>)
      // validate data-url format
      expect(actualParsedUrlData.base64).to.be.true;
      expect(actualParsedUrlData.mediaType).to.equal("application/json");
      expect(actualParsedUrlData.contentType).to.equal("application/json");
      // validate actual data
      const actualParsedMetadata = JSON.parse(atob(actualParsedUrlData.data));
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
        expect(actualCaratAttribute.value).equal(DIAMOND.points / 100);
        return true;
      });
      // Validate all attributes except carat
      expect(actualParsedMetadata).to.deep.equal(expectedMetadataWithoutCarat);
    });

    it("is correct for rebirth", async () => {
      const { diamondDawnMine } = await loadFixture(
        deployDiamondDawnMineContractsFixture
      );
      const videoSuffix = "suffix.mp4";
      const expectedMetadataWithoutCarat = {
        name: "Diamond #1",
        description: "description",
        created_by: "dd",
        image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
        attributes: [
          { trait_type: "Origin", value: "Metaverse" },
          { trait_type: "Type", value: "Reborn" },
          { trait_type: "Identification", value: "Natural" },
          { trait_type: "Color", value: enumToColor(DIAMOND.color) },
          { trait_type: "Cut", value: enumToGrade(DIAMOND.cut) },
          {
            trait_type: "Fluorescence",
            value: enumToFluorescence(DIAMOND.fluorescence),
          },
          { trait_type: "Measurements", value: DIAMOND.measurements },
          { trait_type: "Shape", value: enumToShape(DIAMOND.shape) },
          { trait_type: "Clarity", value: enumToClarity(DIAMOND.clarity) },
          { trait_type: "Polish", value: enumToGrade(DIAMOND.polish) },
          { trait_type: "Symmetry", value: enumToGrade(DIAMOND.symmetry) },
          { trait_type: "Laboratory", value: "GIA" },
          {
            trait_type: "Report Date",
            value: DIAMOND.reportDate,
            display_type: "date",
          },
          { trait_type: "Report Number", value: DIAMOND.reportNumber },
        ],
      };

      await diamondDawnMine.setRebirthVideoUrl(videoSuffix);
      await diamondDawnMine.diamondEruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await diamondDawnMine.enterMine(tokenId);
      await diamondDawnMine.mine(tokenId);
      await diamondDawnMine.cut(tokenId);
      await diamondDawnMine.polish(tokenId);
      await diamondDawnMine.rebirth(tokenId);

      // fetch metadata for token 1
      const actualMetadata = await diamondDawnMine.getDiamondMetadata(tokenId);
      const actualParsedUrlData = parseDataUrl(actualMetadata); // parse data-url (data:[<mediatype>][;base64],<data>)
      // validate data-url format
      expect(actualParsedUrlData.base64).to.be.true;
      expect(actualParsedUrlData.mediaType).to.equal("application/json");
      expect(actualParsedUrlData.contentType).to.equal("application/json");
      // validate actual data
      const actualParsedMetadata = JSON.parse(atob(actualParsedUrlData.data));
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
        expect(actualCaratAttribute.value).equal(DIAMOND.points / 100);
        return true;
      });
      // Validate all attributes except carat
      expect(actualParsedMetadata).to.deep.equal(expectedMetadataWithoutCarat);
    });
  });
});
