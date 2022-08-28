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
  setVideoAndAssertEnterMineMetadata,
  setVideoAndAssertRoughMetadata,
  setVideoAndAssertCutMetadata,
  setVideoAndAssertPolishedMetadata,
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

  describe("initialized", () => {
    const maxDiamonds = 333;
    let mineContract;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawnMine, user2, user1 } = await loadFixture(
        deployMineContract
      );
      mineContract = diamondDawnMine;
      userA = user1;
      userB = user2;
    });

    it("should correctly set DiamondDawn and maxDiamonds", async () => {
      mineContract.initialize(userA.address, maxDiamonds);
      expect(await mineContract.diamondDawn()).to.be.equal(userA.address);
      expect(await mineContract.maxDiamonds()).to.be.equal(maxDiamonds);

      mineContract.initialize(userB.address, maxDiamonds - 10);
      expect(await mineContract.diamondDawn()).to.be.equal(userB.address);
      expect(await mineContract.maxDiamonds()).to.be.equal(maxDiamonds - 10);
    });
  });

  describe("eruption", () => {
    const maxDiamonds = 15;
    let mineContract;
    let admin;
    let diamondDawn;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      mineContract = diamondDawnMine;
      admin = owner;
      diamondDawn = user1;
      user = user2;
      await mineContract.initialize(diamondDawn.address, maxDiamonds);
    });

    it("should REVERT when NOT owner", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map(async (unAuth) => {
          const adminRole = await mineContract.DEFAULT_ADMIN_ROLE();
          return expect(
            mineContract.connect(unAuth).eruption([])
          ).to.be.revertedWith(
            `AccessControl: account ${unAuth.address.toLowerCase()} is missing role ${adminRole}`
          );
        })
      );
    });

    it("should REVERT when EXCEEDS max diamonds", async () => {
      const maxDiamondsArray = _.range(maxDiamonds).map(() => DIAMOND);
      await mineContract.eruption(maxDiamondsArray);
      await expect(mineContract.eruption([DIAMOND])).to.be.revertedWith(
        "Mine overflow"
      );
      expect(await mineContract.diamondCount()).to.be.equal(maxDiamonds);
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.setOpen(false);
      await mineContract.connect(diamondDawn).lockMine();
      await expect(mineContract.eruption([DIAMOND])).to.be.revertedWith(
        "Locked mine"
      );
    });

    it("should SUCCESSFULLY insert 333 diamonds", async () => {
      // TODO - check if we can make it to 333 after optimizations (currently the txn gas limit is 30,395,800)
      const prodDiamondsSize = 200;
      await mineContract.initialize(diamondDawn.address, prodDiamondsSize);
      const maxDiamondsArray = _.range(prodDiamondsSize).map(() => DIAMOND);
      await mineContract.eruption(maxDiamondsArray);
      expect(await mineContract.diamondCount()).to.be.equal(prodDiamondsSize);
    });
  });

  describe("lostShipment", () => {
    let mineContract;
    let admin;
    let diamondDawn;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      mineContract = diamondDawnMine;
      admin = owner;
      diamondDawn = user1;
      user = user2;
    });

    it("should REVERT when NOT owner", async () => {});

    it("should REVERT when NOT POLISHED or REBORN", async () => {});

    it("should REVERT when token doesn't exist", async () => {});

    it("should REVERT when mine is locked", async () => {});

    it("should SUCCESSFULLY replace the diamond", async () => {});
  });

  describe("setOpen", () => {
    // TODO: add tests
  });

  describe("setTypeVideos", () => {
    // TODO: add tests
  });
});
