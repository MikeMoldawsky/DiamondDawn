require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const _ = require("lodash");
const {
  NO_SHAPE_NUM,
  SHAPE,
  ROUGH_SHAPE,
  STAGE,
} = require("./utils/EnumConverterUtils");
const {
  assertPolishedMetadata,
  assertRebornMetadata,
  setAllVideoUrls,
} = require("./utils/MineTestUtils");
const { DIAMOND } = require("./utils/Diamonds");
const { assertOnlyAdmin } = require("./utils/AdminUtils");

// TODO: add admin permissions test (hasRole)

describe("Diamond Dawn Mine Admin", () => {
  async function deployMineContract() {
    const [owner, user1, user2] = await ethers.getSigners();
    const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine");
    const diamondDawnMine = await DiamondDawnMine.deploy();
    await diamondDawnMine.deployed();
    return {
      diamondDawnMine,
      owner,
      user1,
      user2,
    };
  }

  describe("Deployed", () => {
    it("should grant admin permissions to deployer and set correct public defaults", async () => {
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

      expect(await diamondDawnMine.isInitialized()).to.be.false;
      expect(await diamondDawnMine.isLocked()).to.be.false;
      expect(await diamondDawnMine.maxDiamonds()).equal(0);
      expect(await diamondDawnMine.diamondCount()).equal(0);
      expect(await diamondDawnMine.diamondDawn()).to.be.a.properAddress;
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
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.eruption([])
          )
        )
      );
    });

    it("should REVERT when EXCEEDS max diamonds", async () => {
      await mineContract.connect(diamondDawn).initialize(maxDiamonds);
      const maxDiamondsArray = _.range(maxDiamonds).map(() => DIAMOND);
      await mineContract.eruption(maxDiamondsArray);
      await expect(mineContract.eruption([DIAMOND])).to.be.revertedWith(
        "Mine overflow"
      );
      expect(await mineContract.diamondCount()).to.be.equal(maxDiamonds);
    });

    it("should REVERT after mine is locked", async () => {
      await mineContract.connect(diamondDawn).initialize(maxDiamonds);
      await mineContract.connect(diamondDawn).lockMine();
      const unAuthUsers = [diamondDawn, admin, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.eruption([DIAMOND])
          )
        )
      );
    });

    it("should SUCCESSFULLY insert 333 diamonds", async () => {
      // TODO - check if we can make it to 333 after optimizations (currently the txn gas limit is 30,395,800 -> 30,023,384)
      const prodDiamondsSize = 320;
      await mineContract.connect(diamondDawn).initialize(prodDiamondsSize);
      const maxDiamondsArray = _.range(prodDiamondsSize).map(() => DIAMOND);
      await mineContract.eruption(maxDiamondsArray);
      expect(await mineContract.diamondCount()).to.be.equal(prodDiamondsSize);
    });
  });

  describe("lostShipment", () => {
    const tokenId = 1;
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
      await diamondDawnMine.connect(diamondDawn).initialize(333);
      await setAllVideoUrls(diamondDawnMine);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.lostShipment(1, DIAMOND)
          )
        )
      );
    });

    it("should REVERT when token doesn't exist", async () => {
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong stage"
      );
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.connect(diamondDawn).lockMine();
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.lostShipment(tokenId, DIAMOND)
      );
    });

    it("should REVERT when NOT POLISHED or REBORN", async () => {
      await mineContract.eruption([DIAMOND]);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong stage"
      );
      await mineContract.connect(diamondDawn).enter(tokenId);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong stage"
      );
      await mineContract.connect(diamondDawn).mine(tokenId);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong stage"
      );
      await mineContract.connect(diamondDawn).cut(tokenId);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong stage"
      );
      await mineContract.connect(diamondDawn).polish(tokenId);
      await assertPolishedMetadata(
        diamondDawn,
        mineContract,
        tokenId,
        1,
        DIAMOND
      );
      await mineContract.connect(diamondDawn).ship(tokenId);
      await assertPolishedMetadata(
        diamondDawn,
        mineContract,
        tokenId,
        1,
        DIAMOND
      );
      const replacedDiamond = { ...DIAMOND, points: DIAMOND.points + 10 };
      await mineContract.lostShipment(tokenId, replacedDiamond);
      await assertPolishedMetadata(
        diamondDawn,
        mineContract,
        tokenId,
        1,
        replacedDiamond
      );
      const replacedDiamond2 = {
        ...DIAMOND,
        points: DIAMOND.points + 20,
        shape: DIAMOND.shape + 1,
      };
      const rebornId = 1;
      await mineContract.connect(diamondDawn).rebirth(tokenId);
      await mineContract.lostShipment(tokenId, replacedDiamond2);
      await assertRebornMetadata(
        diamondDawn,
        mineContract,
        tokenId,
        rebornId,
        replacedDiamond2
      );
    });
  });

  describe("setStageVideos", () => {
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
      await diamondDawnMine.connect(diamondDawn).initialize(333);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.setStageVideos(STAGE.NO_STAGE, [])
          )
        )
      );
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.connect(diamondDawn).lockMine();
      const stages = [
        STAGE.NO_STAGE,
        STAGE.INVITE,
        STAGE.MINE,
        STAGE.CUT,
        STAGE.POLISH,
        STAGE.SHIP,
      ];

      await Promise.all(
        stages.map((stage) =>
          assertOnlyAdmin(admin, mineContract, (contract) =>
            contract.setStageVideos(stage, [])
          )
        )
      );
    });

    it("should REVERT when no type url is locked", async () => {
      await expect(
        mineContract.setStageVideos(STAGE.NO_STAGE, [])
      ).to.be.revertedWithoutReason();
    });

    it("should SUCCESSFULLY set videos", async () => {
      const enterMine = "infinity.mp4";
      const roughMakeable1 = "rough_1.mp4";
      const roughMakeable2 = "rough_2.mp4";
      // cut
      const cutPear = "cut_pear.mp4";
      const cutRound = "cut_round.mp4";
      const cutOval = "cut_oval.mp4";
      const cutRadiant = "cut_radiant.mp4";
      // polished
      const polishedPear = "polished_pear.mp4";
      const polishedRound = "polished_round.mp4";
      const polishedOval = "polished_oval.mp4";
      const polishedRadiant = "polished_radiant.mp4";
      // reborn
      const rebornVideo = "diamond_dawn.mp4";

      await mineContract.setStageVideos(STAGE.INVITE, [
        { shape: NO_SHAPE_NUM, video: enterMine },
      ]);
      await mineContract.setStageVideos(STAGE.MINE, [
        { shape: ROUGH_SHAPE.MAKEABLE_1, video: roughMakeable1 },
        { shape: ROUGH_SHAPE.MAKEABLE_2, video: roughMakeable2 },
      ]);

      await mineContract.setStageVideos(STAGE.CUT, [
        { shape: SHAPE.PEAR, video: cutPear },
        { shape: SHAPE.ROUND, video: cutRound },
        { shape: SHAPE.OVAL, video: cutOval },
        { shape: SHAPE.RADIANT, video: cutRadiant },
      ]);
      await mineContract.setStageVideos(STAGE.POLISH, [
        { shape: SHAPE.PEAR, video: polishedPear },
        { shape: SHAPE.ROUND, video: polishedRound },
        { shape: SHAPE.OVAL, video: polishedOval },
        { shape: SHAPE.RADIANT, video: polishedRadiant },
      ]);
      await mineContract.setStageVideos(STAGE.SHIP, [
        { shape: NO_SHAPE_NUM, video: rebornVideo },
      ]);

      expect(await mineContract.stageToShapeVideo(STAGE.INVITE, 0)).to.be.equal(
        enterMine
      );

      expect(
        await mineContract.stageToShapeVideo(STAGE.MINE, ROUGH_SHAPE.MAKEABLE_1)
      ).to.be.equal(roughMakeable1);
      expect(
        await mineContract.stageToShapeVideo(STAGE.MINE, ROUGH_SHAPE.MAKEABLE_2)
      ).to.be.equal(roughMakeable2);

      expect(
        await mineContract.stageToShapeVideo(STAGE.CUT, SHAPE.PEAR)
      ).to.be.equal(cutPear);
      expect(
        await mineContract.stageToShapeVideo(STAGE.CUT, SHAPE.ROUND)
      ).to.be.equal(cutRound);
      expect(
        await mineContract.stageToShapeVideo(STAGE.CUT, SHAPE.OVAL)
      ).to.be.equal(cutOval);
      expect(
        await mineContract.stageToShapeVideo(STAGE.CUT, SHAPE.RADIANT)
      ).to.be.equal(cutRadiant);

      expect(
        await mineContract.stageToShapeVideo(STAGE.POLISH, SHAPE.PEAR)
      ).to.be.equal(polishedPear);
      expect(
        await mineContract.stageToShapeVideo(STAGE.POLISH, SHAPE.ROUND)
      ).to.be.equal(polishedRound);
      expect(
        await mineContract.stageToShapeVideo(STAGE.POLISH, SHAPE.OVAL)
      ).to.be.equal(polishedOval);
      expect(
        await mineContract.stageToShapeVideo(STAGE.POLISH, SHAPE.RADIANT)
      ).to.be.equal(polishedRadiant);

      expect(await mineContract.stageToShapeVideo(STAGE.SHIP, 0)).to.be.equal(
        rebornVideo
      );
    });
  });
});
