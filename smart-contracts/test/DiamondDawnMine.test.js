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
  assertEnterMineMetadata,
  assertRoughMetadata,
  assertCutMetadata,
  assertPolishedMetadata,
  setAllVideoUrls,
  assertRebornMetadata,
} = require("./utils/MineTestUtils");
const { DIAMOND } = require("./utils/Diamonds");

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

describe("Diamond Dawn Mine", () => {
  describe("initialized", () => {
    const maxDiamonds = 333;
    let mineContract;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, user1 } = await loadFixture(deployMineContract);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should correctly set dd, maxDiamonds, init & open", async () => {
      await mineContract.connect(user).initialize(maxDiamonds);
      expect(await mineContract.diamondDawn()).to.be.equal(user.address);
      expect(await mineContract.maxDiamonds()).to.be.equal(maxDiamonds);
      expect(await mineContract.isInitialized()).to.be.true;
      expect(await mineContract.isLocked()).to.be.false;
    });

    it("should REVERT when called more than once", async () => {
      await mineContract.connect(user).initialize(maxDiamonds);
      await expect(
        mineContract.connect(user).initialize(maxDiamonds)
      ).to.be.revertedWith("Initialized");
      await expect(mineContract.initialize(maxDiamonds)).to.be.revertedWith(
        "Initialized"
      );
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
      await diamondDawnMine.initialize(333);
      await setAllVideoUrls(diamondDawnMine);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should REVERT when NOT diamond dawn", async () => {
      await expect(
        mineContract.connect(user).enter(tokenId)
      ).to.be.revertedWith("Only DD");
    });

    it("should REVERT when mine is LOCKED", async () => {
      await mineContract.lockMine();
      await expect(mineContract.enter(tokenId)).to.be.revertedWith("Locked");
    });

    it("should REVERT when token EXISTS", async () => {
      await mineContract.enter(tokenId); // token exists
      await expect(mineContract.enter(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );
    });

    it("should enter 4 tokens and generate metadata", async () => {
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await expect(mineContract.enter(i))
            .to.emit(mineContract, "Enter")
            .withArgs(i);
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
      await diamondDawnMine.initialize(333);
      await setAllVideoUrls(diamondDawnMine);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(mineContract.connect(user).mine(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.lockMine();
      await expect(mineContract.mine(tokenId)).to.be.revertedWith("Locked");
    });

    it("should REVERT when mine is DRY", async () => {
      await expect(mineContract.mine(tokenId)).to.be.revertedWith("Dry mine");
    });

    it("should REVERT when token is NOT invite type", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.eruption([DIAMOND]);
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);
      await expect(mineContract.mine(tokenId)).to.be.revertedWith(
        "Wrong stage"
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
        _.range(1, 5).map(async (i) => {
          const tokenId = 5 - i;
          await expect(mineContract.mine(tokenId))
            .to.emit(mineContract, "Mine")
            .withArgs(tokenId);
          await assertRoughMetadata(mineContract, tokenId, i, DIAMOND);
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
      await diamondDawnMine.initialize(333);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(mineContract.connect(user).cut(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is Locked", async () => {
      await mineContract.lockMine();
      await expect(mineContract.cut(tokenId)).to.be.revertedWith("Locked");
    });

    it("should REVERT when token is NOT rough type", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.enter(tokenId);
      await expect(mineContract.cut(tokenId)).to.be.revertedWith("Wrong stage");
      await mineContract.mine(tokenId);
      await mineContract.cut(tokenId);
      await expect(mineContract.cut(tokenId)).to.be.revertedWith("Wrong stage");
    });

    it("should cut 4 tokens and generate metadata", async () => {
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
          const tokenId = 5 - i;
          await expect(await mineContract.cut(tokenId))
            .to.emit(mineContract, "Cut")
            .withArgs(tokenId);
          await assertCutMetadata(mineContract, tokenId, i, DIAMOND);
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
      await diamondDawnMine.initialize(333);
      mineContract = diamondDawnMine;
      user = user1;
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(
        mineContract.connect(user).polish(tokenId)
      ).to.be.revertedWith("Only DD");
    });

    it("should REVERT when mine is CLOSED", async () => {
      await mineContract.lockMine();
      await expect(mineContract.polish(tokenId)).to.be.revertedWith("Locked");
    });

    it("should REVERT when token is NOT cut type", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.enter(tokenId);
      await expect(mineContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );
      await mineContract.mine(tokenId);
      await expect(mineContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );
      await mineContract.cut(tokenId);
      await mineContract.polish(tokenId);
      await expect(mineContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );
    });

    it("should polish 4 tokens and generate metadata", async () => {
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
          const tokenId = 5 - i;
          await expect(mineContract.polish(tokenId))
            .to.emit(mineContract, "Polish")
            .withArgs(tokenId);
          await assertPolishedMetadata(mineContract, tokenId, i, DIAMOND);
        })
      );
    });
  });

  describe("ship", () => {
    // TODO: add tests
  });

  describe("rebirth", () => {
    // TODO: add tests
  });

  describe("getMetadata", () => {
    const tokenId = 1;
    let mineContract;
    let user;
    beforeEach(async () => {
      const { diamondDawnMine, owner, user1 } = await loadFixture(
        deployMineContract
      );
      await diamondDawnMine.initialize(333);
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
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await assertEnterMineMetadata(mineContract, tokenId);
    });

    it("is correct for mine", async () => {
      await mineContract.eruption([DIAMOND]);
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);

      await assertRoughMetadata(mineContract, tokenId, 1, DIAMOND);
    });

    it("is correct for cut", async () => {
      await mineContract.eruption([DIAMOND]);
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);
      await mineContract.cut(tokenId);

      // fetch metadata for token 1
      await assertCutMetadata(mineContract, tokenId, 1, DIAMOND);
    });

    it("is correct for polish", async () => {
      await mineContract.eruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);
      await mineContract.cut(tokenId);
      await mineContract.polish(tokenId);
      await assertPolishedMetadata(mineContract, tokenId, 1, DIAMOND);
    });

    it("is correct for rebirth", async () => {
      await mineContract.eruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await mineContract.enter(tokenId);
      await mineContract.mine(tokenId);
      await mineContract.cut(tokenId);
      await mineContract.polish(tokenId);
      await mineContract.ship(tokenId);
      await mineContract.rebirth(tokenId);
      const physicalTokenId = 1;
      await assertRebornMetadata(
        mineContract,
        tokenId,
        physicalTokenId,
        DIAMOND
      );
    });
  });

  describe("isReady", () => {
    let mineContract;
    const numDiamonds = 5;
    beforeEach(async () => {
      const { diamondDawnMine, owner } = await loadFixture(deployMineContract);
      await diamondDawnMine.initialize(numDiamonds);
      mineContract = diamondDawnMine;
    });

    it("should be FALSE for all types by default", async () => {
      expect(await mineContract.isReady(STAGE.NO_STAGE)).to.be.false;
      expect(await mineContract.isReady(STAGE.INVITE)).to.be.false;
      expect(await mineContract.isReady(STAGE.MINE)).to.be.false;
      expect(await mineContract.isReady(STAGE.CUT)).to.be.false;
      expect(await mineContract.isReady(STAGE.POLISH)).to.be.false;
      expect(await mineContract.isReady(STAGE.SHIP)).to.be.false;
    });

    it("should be TRUE only for ENTER_MINE", async () => {
      await mineContract.setStageVideos(STAGE.INVITE, [
        { shape: NO_SHAPE_NUM, video: "hi.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.NO_STAGE)).to.be.false;
      expect(await mineContract.isReady(STAGE.INVITE)).to.be.true;
      expect(await mineContract.isReady(STAGE.MINE)).to.be.false;
      expect(await mineContract.isReady(STAGE.CUT)).to.be.false;
      expect(await mineContract.isReady(STAGE.POLISH)).to.be.false;
      expect(await mineContract.isReady(STAGE.SHIP)).to.be.false;
    });

    it("should be TRUE only for ROUGH when video set and mine populated", async () => {
      await mineContract.setStageVideos(STAGE.MINE, [
        { shape: ROUGH_SHAPE.MAKEABLE_1, video: "1.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.MINE)).to.be.false;
      await mineContract.setStageVideos(STAGE.MINE, [
        { shape: ROUGH_SHAPE.MAKEABLE_2, video: "2.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.MINE)).to.be.false;
      const diamonds = _.range(numDiamonds - 1).map((_) => DIAMOND);
      await mineContract.eruption(diamonds);
      expect(await mineContract.isReady(STAGE.MINE)).to.be.false;

      await mineContract.eruption([DIAMOND]); // now mine has all diamonds
      expect(await mineContract.isReady(STAGE.NO_STAGE)).to.be.false;
      expect(await mineContract.isReady(STAGE.INVITE)).to.be.false;
      expect(await mineContract.isReady(STAGE.MINE)).to.be.true;
      expect(await mineContract.isReady(STAGE.CUT)).to.be.false;
      expect(await mineContract.isReady(STAGE.POLISH)).to.be.false;
      expect(await mineContract.isReady(STAGE.SHIP)).to.be.false;
    });

    it("should be TRUE only for CUT", async () => {
      await mineContract.setStageVideos(STAGE.CUT, [
        { shape: SHAPE.PEAR, video: "1.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.CUT)).to.be.false;
      await mineContract.setStageVideos(STAGE.CUT, [
        { shape: SHAPE.ROUND, video: "2.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.CUT)).to.be.false;
      await mineContract.setStageVideos(STAGE.CUT, [
        { shape: SHAPE.OVAL, video: "3.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.CUT)).to.be.false;
      await mineContract.setStageVideos(STAGE.CUT, [
        { shape: SHAPE.RADIANT, video: "4.mp4" },
      ]);

      expect(await mineContract.isReady(STAGE.NO_STAGE)).to.be.false;
      expect(await mineContract.isReady(STAGE.INVITE)).to.be.false;
      expect(await mineContract.isReady(STAGE.MINE)).to.be.false;
      expect(await mineContract.isReady(STAGE.CUT)).to.be.true;
      expect(await mineContract.isReady(STAGE.POLISH)).to.be.false;
      expect(await mineContract.isReady(STAGE.SHIP)).to.be.false;
    });

    it("should be TRUE only for POLISHED", async () => {
      await mineContract.setStageVideos(STAGE.POLISH, [
        { shape: SHAPE.PEAR, video: "1.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.POLISH)).to.be.false;
      await mineContract.setStageVideos(STAGE.POLISH, [
        { shape: SHAPE.ROUND, video: "2.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.POLISH)).to.be.false;
      await mineContract.setStageVideos(STAGE.POLISH, [
        { shape: SHAPE.OVAL, video: "3.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.POLISH)).to.be.false;
      await mineContract.setStageVideos(STAGE.POLISH, [
        { shape: SHAPE.RADIANT, video: "4.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.NO_STAGE)).to.be.false;
      expect(await mineContract.isReady(STAGE.INVITE)).to.be.false;
      expect(await mineContract.isReady(STAGE.MINE)).to.be.false;
      expect(await mineContract.isReady(STAGE.CUT)).to.be.false;
      expect(await mineContract.isReady(STAGE.POLISH)).to.be.true;
      expect(await mineContract.isReady(STAGE.SHIP)).to.be.false;
    });

    it("should be TRUE only for REBORN", async () => {
      await mineContract.setStageVideos(STAGE.SHIP, [
        { shape: NO_SHAPE_NUM, video: "hi.mp4" },
      ]);
      expect(await mineContract.isReady(STAGE.NO_STAGE)).to.be.false;
      expect(await mineContract.isReady(STAGE.INVITE)).to.be.false;
      expect(await mineContract.isReady(STAGE.MINE)).to.be.false;
      expect(await mineContract.isReady(STAGE.CUT)).to.be.false;
      expect(await mineContract.isReady(STAGE.POLISH)).to.be.false;
      expect(await mineContract.isReady(STAGE.SHIP)).to.be.true;
    });
  });
});
