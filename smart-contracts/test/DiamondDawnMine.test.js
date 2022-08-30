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
  NO_SHAPE_NUM,
  DIAMOND_DAWN_TYPE,
  SHAPE,
  ROUGH_SHAPE,
} = require("./utils/EnumConverterUtils");
const {
  assertEnterMineMetadata,
  assertRoughMetadata,
  assertCutMetadata,
  assertPolishedMetadata,
  setAllVideoUrls,
} = require("./utils/MetadataTestUtils");

const DIAMOND = {
  number: 1111111111,
  date: 1659254421,
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
  async function deployMineContract() {
    const [owner, user1, user2, user3, user4, user5, user6, user7, user8] =
      await ethers.getSigners();
    const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine");
    const diamondDawnMine = await DiamondDawnMine.deploy([]);
    await diamondDawnMine.deployed();
    await diamondDawnMine.initialize(owner.address, 333);
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

  describe("Deployed", () => {
    it("should grant admin permissions", async () => {
      const [owner, user1, user2] = await ethers.getSigners();
      const DiamondDawnMine = await ethers.getContractFactory(
        "DiamondDawnMine"
      );
      const diamondDawnMine = await DiamondDawnMine.deploy([]);
      await diamondDawnMine.deployed();
      const adminRole = await diamondDawnMine.DEFAULT_ADMIN_ROLE();
      expect(await diamondDawnMine.hasRole(adminRole, owner.address)).to.be
        .true;
      expect(await diamondDawnMine.hasRole(adminRole, user1.address)).to.be
        .false;
      expect(await diamondDawnMine.hasRole(adminRole, user2.address)).to.be
        .false;
    });
  });

  describe("enter", () => {
    const tokenId = 1;
    let mineContract;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1 } = await loadFixture(
        deployMineContract
      );
      await diamondDawnMine.initialize(owner.address, 333);
      await setAllVideoUrls(diamondDawnMine);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should REVERT when NOT diamond dawn", async () => {
      await expect(
        mineContract.connect(user).enter(tokenId)
      ).to.be.revertedWith("Only DD");
    });

    it("should REVERT when mine is CLOSED", async () => {
      await mineContract.setOpen(false);
      await expect(mineContract.enter(tokenId)).to.be.revertedWith(
        "Mine Closed"
      );
    });

    it("should REVERT when token EXISTS", async () => {
      await mineContract.enter(tokenId); // token exists
      await expect(mineContract.enter(tokenId)).to.be.revertedWith(
        "Wrong type"
      );
    });

    it("should enter 4 tokens and generate metadata", async () => {
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await mineContract.enter(i);
          await assertEnterMineMetadata(mineContract, i);
        })
      );
    });
  });

  describe("mine", () => {
    const tokenId = 1;
    let mineContract;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1 } = await loadFixture(
        deployMineContract
      );
      await diamondDawnMine.initialize(owner.address, 333);
      await setAllVideoUrls(diamondDawnMine);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(mineContract.connect(user).mine(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is CLOSED", async () => {
      await mineContract.setOpen(false);
      await expect(mineContract.mine(tokenId)).to.be.revertedWith(
        "Mine Closed"
      );
    });

    it("should REVERT when mine is DRY", async () => {
      await expect(mineContract.mine(tokenId)).to.be.revertedWith("Dry mine");
    });

    it("should REVERT when token is NOT invite type", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.eruption([DIAMOND]);
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);
      await expect(mineContract.mine(tokenId)).to.be.revertedWith("Wrong type");
    });

    it("should mine 4 tokens and generate metadata", async () => {
      // Prepare diamonds and invitations
      await Promise.all(
        _.range(1, 5).map(async () => {
          await mineContract.eruption([DIAMOND]);
        })
      );
      await Promise.all(
        _.range(1, 5).map(async (i) => await mineContract.enter(i))
      );
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await mineContract.mine(i);
          await assertRoughMetadata(mineContract, i, DIAMOND);
        })
      );
    });
  });

  describe("cut", () => {
    const tokenId = 1;
    let mineContract;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1 } = await loadFixture(
        deployMineContract
      );
      await setAllVideoUrls(diamondDawnMine);
      await diamondDawnMine.initialize(owner.address, 333);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(mineContract.connect(user).cut(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is CLOSED", async () => {
      await mineContract.setOpen(false);
      await expect(mineContract.cut(tokenId)).to.be.revertedWith("Mine Closed");
    });

    it("should REVERT when token is NOT rough type", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.enter(tokenId);
      await expect(mineContract.cut(tokenId)).to.be.revertedWith("Wrong type");
      await mineContract.mine(tokenId);
      await mineContract.cut(tokenId);
      await expect(mineContract.cut(tokenId)).to.be.revertedWith("Wrong type");
    });

    it("should mine 4 tokens and generate metadata", async () => {
      // Prepare diamonds and invitations
      await Promise.all(
        _.range(1, 5).map(async () => {
          await mineContract.eruption([DIAMOND]);
        })
      );
      await Promise.all(
        _.range(1, 5).map(async (i) => await mineContract.enter(i))
      );

      await Promise.all(
        _.range(1, 5).map(async (i) => await mineContract.mine(i))
      );
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await mineContract.cut(i);
          await assertCutMetadata(mineContract, i, DIAMOND);
        })
      );
    });
  });

  describe("polish", () => {
    const tokenId = 1;
    let mineContract;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1 } = await loadFixture(
        deployMineContract
      );
      await setAllVideoUrls(diamondDawnMine);
      await diamondDawnMine.initialize(owner.address, 333);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(
        mineContract.connect(user).polish(tokenId)
      ).to.be.revertedWith("Only DD");
    });

    it("should REVERT when mine is CLOSED", async () => {
      await mineContract.setOpen(false);
      await expect(mineContract.polish(tokenId)).to.be.revertedWith(
        "Mine Closed"
      );
    });

    it("should REVERT when token is NOT cut type", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.enter(tokenId);
      await expect(mineContract.polish(tokenId)).to.be.revertedWith(
        "Wrong type"
      );
      await mineContract.mine(tokenId);
      await expect(mineContract.polish(tokenId)).to.be.revertedWith(
        "Wrong type"
      );
      await mineContract.cut(tokenId);
      await mineContract.polish(tokenId);
      await expect(mineContract.polish(tokenId)).to.be.revertedWith(
        "Wrong type"
      );
    });

    it("should mine 4 tokens and generate metadata", async () => {
      // Prepare diamonds and invitations
      await Promise.all(
        _.range(1, 5).map(async () => {
          await mineContract.eruption([DIAMOND]);
        })
      );
      await Promise.all(
        _.range(1, 5).map(async (i) => await mineContract.enter(i))
      );

      await Promise.all(
        _.range(1, 5).map(async (i) => await mineContract.mine(i))
      );

      await Promise.all(
        _.range(1, 5).map(async (i) => await mineContract.cut(i))
      );

      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await mineContract.polish(i);
          await assertPolishedMetadata(mineContract, i, DIAMOND);
        })
      );
    });
  });

  describe("getMetadata", () => {
    const tokenId = 1;
    let mineContract;
    let user;
    beforeEach(async () => {
      const { diamondDawnMine, owner, user1 } = await loadFixture(
        deployMineContract
      );
      await diamondDawnMine.initialize(owner.address, 333);
      await setAllVideoUrls(diamondDawnMine);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should REVERT when NOT diamond dawn", async () => {
      await expect(
        mineContract.connect(user).getMetadata(tokenId)
      ).to.be.revertedWith("Only DD");
    });

    it("should REVERT when token doesn't exist", async () => {
      await expect(mineContract.getMetadata(1)).to.be.revertedWith(
        "Don't exist"
      );
    });

    it("is correct for enter mine", async () => {
      // Token 1 enters mine
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await assertEnterMineMetadata(mineContract, tokenId);
    });

    it("is correct for mine", async () => {
      await mineContract.eruption([DIAMOND]);
      // Token 1 enters mine
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);

      await assertRoughMetadata(mineContract, tokenId, DIAMOND);
    });

    it("is correct for cut", async () => {
      await mineContract.eruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);
      await mineContract.cut(tokenId);

      // fetch metadata for token 1
      await assertCutMetadata(mineContract, tokenId, DIAMOND);
    });

    it("is correct for polish", async () => {
      await mineContract.eruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);
      await mineContract.cut(tokenId);
      await mineContract.polish(tokenId);

      // fetch metadata for token 1
      await assertPolishedMetadata(mineContract, tokenId, DIAMOND);
    });

    it("is correct for rebirth", async () => {
      const videoSuffix = "suffix.mp4";
      const expectedMetadataWithoutCarat = {
        name: "Diamond #1",
        description: "description",
        created_by: "dd",
        image: `https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/${videoSuffix}`,
        attributes: [
          { trait_type: "Type", value: "Reborn" },
          { trait_type: "Origin", value: "Metaverse" },
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
            value: DIAMOND.date,
            display_type: "date",
          },
          { trait_type: "Report Number", value: DIAMOND.number },
          { trait_type: "Physical Id", value: 1 },
        ],
      };

      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.REBORN, [
        { shape: NO_SHAPE_NUM, video: videoSuffix },
      ]);
      await mineContract.eruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);
      await mineContract.cut(tokenId);
      await mineContract.polish(tokenId);
      await mineContract.ship(tokenId);
      await mineContract.rebirth(tokenId);

      // fetch metadata for token 1
      const actualMetadata = await mineContract.getMetadata(tokenId);
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

  describe("isMineReady", () => {
    let mineContract;
    const numDiamonds = 5;
    beforeEach(async () => {
      const { diamondDawnMine, owner } = await loadFixture(deployMineContract);
      await diamondDawnMine.initialize(owner.address, numDiamonds);
      mineContract = diamondDawnMine;
    });

    it("should be FALSE for all types by default", async () => {
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.NO_TYPE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ENTER_MINE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ROUGH)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.CUT)).to.be.false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.POLISHED)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.REBORN)).to.be
        .false;
    });

    it("should be TRUE only for ENTER_MINE", async () => {
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ENTER_MINE, [
        { shape: NO_SHAPE_NUM, video: "hi.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.NO_TYPE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ENTER_MINE)).to.be
        .true;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ROUGH)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.CUT)).to.be.false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.POLISHED)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.REBORN)).to.be
        .false;
    });

    it("should be TRUE only for ROUGH when video set and mine populated", async () => {
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ROUGH, [
        { shape: ROUGH_SHAPE.MAKEABLE_1, video: "1.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ROUGH)).to.be
        .false;
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ROUGH, [
        { shape: ROUGH_SHAPE.MAKEABLE_2, video: "2.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ROUGH)).to.be
        .false;
      const diamonds = _.range(numDiamonds - 1).map((_) => DIAMOND);
      await mineContract.eruption(diamonds);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ROUGH)).to.be
        .false;

      await mineContract.eruption([DIAMOND]); // now mine has all diamonds
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.NO_TYPE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ENTER_MINE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ROUGH)).to.be
        .true;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.CUT)).to.be.false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.POLISHED)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.REBORN)).to.be
        .false;
    });

    it("should be TRUE only for CUT", async () => {
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.CUT, [
        { shape: SHAPE.PEAR, video: "1.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.CUT)).to.be.false;
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.CUT, [
        { shape: SHAPE.ROUND, video: "2.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.CUT)).to.be.false;
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.CUT, [
        { shape: SHAPE.OVAL, video: "3.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.CUT)).to.be.false;
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.CUT, [
        { shape: SHAPE.RADIANT, video: "4.mp4" },
      ]);

      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.NO_TYPE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ENTER_MINE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ROUGH)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.CUT)).to.be.true;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.POLISHED)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.REBORN)).to.be
        .false;
    });

    it("should be TRUE only for POLISHED", async () => {
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.POLISHED, [
        { shape: SHAPE.PEAR, video: "1.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.POLISHED)).to.be
        .false;
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.POLISHED, [
        { shape: SHAPE.ROUND, video: "2.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.POLISHED)).to.be
        .false;
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.POLISHED, [
        { shape: SHAPE.OVAL, video: "3.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.POLISHED)).to.be
        .false;
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.POLISHED, [
        { shape: SHAPE.RADIANT, video: "4.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.NO_TYPE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ENTER_MINE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ROUGH)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.CUT)).to.be.false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.POLISHED)).to.be
        .true;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.REBORN)).to.be
        .false;
    });

    it("should be TRUE only for REBORN", async () => {
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.REBORN, [
        { shape: NO_SHAPE_NUM, video: "hi.mp4" },
      ]);
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.NO_TYPE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ENTER_MINE)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.ROUGH)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.CUT)).to.be.false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.POLISHED)).to.be
        .false;
      expect(await mineContract.isMineReady(DIAMOND_DAWN_TYPE.REBORN)).to.be
        .true;
    });
  });
});
