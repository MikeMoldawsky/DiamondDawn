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
const { assertOnlyAdmin } = require("./utils/AdminUtils");

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
    let admin;
    let diamondDawn;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      mineContract = diamondDawnMine;
      admin = owner;
      user = user1;
      diamondDawn = user2;
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
    let diamondDawn;
    let admin;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      diamondDawn = user2;
      mineContract = diamondDawnMine;
      user = user1;
      admin = owner;
      await diamondDawnMine.connect(diamondDawn).initialize(333);
      await setAllVideoUrls(diamondDawnMine);
    });

    it("should REVERT when NOT diamond dawn", async () => {
      await expect(
        mineContract.connect(user).enter(tokenId)
      ).to.be.revertedWith("Only DD");
    });

    it("should REVERT when mine is LOCKED", async () => {
      await mineContract.connect(diamondDawn).lockMine();
      await expect(
        mineContract.connect(diamondDawn).enter(tokenId)
      ).to.be.revertedWith("Locked");
    });

    it("should REVERT when token EXISTS", async () => {
      await mineContract.connect(diamondDawn).enter(tokenId); // token exists
      await expect(
        mineContract.connect(diamondDawn).enter(tokenId)
      ).to.be.revertedWith("Wrong stage");
    });

    it("should enter 4 tokens and generate metadata", async () => {
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await expect(mineContract.connect(diamondDawn).enter(i))
            .to.emit(mineContract, "Enter")
            .withArgs(i);
          await assertEnterMineMetadata(diamondDawn, mineContract, i);
        })
      );
    });
  });

  describe("mine", () => {
    const tokenId = 1;
    let mineContract;
    let user;
    let admin;
    let diamondDawn;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      mineContract = diamondDawnMine;
      user = user1;
      admin = owner;
      diamondDawn = user2;
      await diamondDawnMine.connect(diamondDawn).initialize(333);
      await setAllVideoUrls(diamondDawnMine);
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(mineContract.connect(user).mine(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.connect(diamondDawn).lockMine();
      await expect(
        mineContract.connect(diamondDawn).mine(tokenId)
      ).to.be.revertedWith("Locked");
    });

    it("should REVERT when mine is DRY", async () => {
      await expect(
        mineContract.connect(diamondDawn).mine(tokenId)
      ).to.be.revertedWith("Dry mine");
    });

    it("should REVERT when token is NOT invite type", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.eruption([DIAMOND]);
      await mineContract.connect(diamondDawn).enter(tokenId);
      await mineContract.connect(diamondDawn).mine(tokenId);
      await expect(
        mineContract.connect(diamondDawn).mine(tokenId)
      ).to.be.revertedWith("Wrong stage");
    });

    it("should mine 4 tokens and generate metadata", async () => {
      // Prepare diamonds and invitations
      await Promise.all(
        _.range(1, 5).map(async () => {
          await mineContract.eruption([DIAMOND]);
        })
      );
      await Promise.all(
        _.range(1, 5).map(
          async (i) => await mineContract.connect(diamondDawn).enter(i)
        )
      );
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          const tokenId = 5 - i;
          await expect(mineContract.connect(diamondDawn).mine(tokenId))
            .to.emit(mineContract, "Mine")
            .withArgs(tokenId);
          await assertRoughMetadata(
            diamondDawn,
            mineContract,
            tokenId,
            i,
            DIAMOND
          );
        })
      );
    });
  });

  describe("cut", () => {
    const tokenId = 1;
    let mineContract;
    let user;
    let diamondDawn;
    let admin;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      mineContract = diamondDawnMine;
      user = user1;
      admin = owner;
      diamondDawn = user2;
      await setAllVideoUrls(diamondDawnMine);
      await diamondDawnMine.connect(diamondDawn).initialize(333);
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(mineContract.connect(user).cut(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is Locked", async () => {
      await mineContract.connect(diamondDawn).lockMine();
      await expect(
        mineContract.connect(diamondDawn).cut(tokenId)
      ).to.be.revertedWith("Locked");
    });

    it("should REVERT when token is NOT rough type", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.connect(diamondDawn).enter(tokenId);
      await expect(
        mineContract.connect(diamondDawn).cut(tokenId)
      ).to.be.revertedWith("Wrong stage");
      await mineContract.connect(diamondDawn).mine(tokenId);
      await mineContract.connect(diamondDawn).cut(tokenId);
      await expect(
        mineContract.connect(diamondDawn).cut(tokenId)
      ).to.be.revertedWith("Wrong stage");
    });

    it("should cut 4 tokens and generate metadata", async () => {
      // Prepare diamonds and invitations
      await Promise.all(
        _.range(1, 5).map(async () => {
          await mineContract.eruption([DIAMOND]);
        })
      );
      await Promise.all(
        _.range(1, 5).map(
          async (i) => await mineContract.connect(diamondDawn).enter(i)
        )
      );

      await Promise.all(
        _.range(1, 5).map(
          async (i) => await mineContract.connect(diamondDawn).mine(i)
        )
      );
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          const tokenId = 5 - i;
          await expect(await mineContract.connect(diamondDawn).cut(tokenId))
            .to.emit(mineContract, "Cut")
            .withArgs(tokenId);
          await assertCutMetadata(
            diamondDawn,
            mineContract,
            tokenId,
            i,
            DIAMOND
          );
        })
      );
    });
  });

  describe("polish", () => {
    const tokenId = 1;
    let mineContract;
    let user;
    let admin;
    let diamondDawn;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      mineContract = diamondDawnMine;
      user = user1;
      admin = owner;
      diamondDawn = user2;
      await setAllVideoUrls(diamondDawnMine);
      await diamondDawnMine.connect(diamondDawn).initialize(333);
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(
        mineContract.connect(user).polish(tokenId)
      ).to.be.revertedWith("Only DD");
    });

    it("should REVERT when mine is Locked", async () => {
      await mineContract.connect(diamondDawn).lockMine();
      await expect(
        mineContract.connect(diamondDawn).polish(tokenId)
      ).to.be.revertedWith("Locked");
    });

    it("should REVERT when token is NOT cut type", async () => {
      await mineContract.eruption([DIAMOND]);
      await mineContract.connect(diamondDawn).enter(tokenId);
      await expect(
        mineContract.connect(diamondDawn).polish(tokenId)
      ).to.be.revertedWith("Wrong stage");
      await mineContract.connect(diamondDawn).mine(tokenId);
      await expect(
        mineContract.connect(diamondDawn).polish(tokenId)
      ).to.be.revertedWith("Wrong stage");
      await mineContract.connect(diamondDawn).cut(tokenId);
      await mineContract.connect(diamondDawn).polish(tokenId);
      await expect(
        mineContract.connect(diamondDawn).polish(tokenId)
      ).to.be.revertedWith("Wrong stage");
    });

    it("should polish 4 tokens and generate metadata", async () => {
      // Prepare diamonds and invitations
      await Promise.all(
        _.range(1, 5).map(async () => {
          await mineContract.eruption([DIAMOND]);
        })
      );
      await Promise.all(
        _.range(1, 5).map(
          async (i) => await mineContract.connect(diamondDawn).enter(i)
        )
      );

      await Promise.all(
        _.range(1, 5).map(
          async (i) => await mineContract.connect(diamondDawn).mine(i)
        )
      );

      await Promise.all(
        _.range(1, 5).map(
          async (i) => await mineContract.connect(diamondDawn).cut(i)
        )
      );

      await Promise.all(
        _.range(1, 5).map(async (i) => {
          const tokenId = 5 - i;
          await expect(mineContract.connect(diamondDawn).polish(tokenId))
            .to.emit(mineContract, "Polish")
            .withArgs(tokenId);
          await assertPolishedMetadata(
            diamondDawn,
            mineContract,
            tokenId,
            i,
            DIAMOND
          );
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

  describe("lockMine", () => {
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
      user = user1;
      diamondDawn = user2;
      await diamondDawnMine.connect(diamondDawn).initialize(5);
    });

    it("should REVERT when NOT Diamond Dawn", async () => {
      const unAuthUsers = [admin, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          expect(mineContract.connect(unAuth).lockMine()).to.be.revertedWith(
            "Only DD"
          )
        )
      );
      await mineContract.connect(diamondDawn).lockMine(); // works for diamond dawn
    });

    it("should LOCK all setters", async () => {
      await mineContract.connect(diamondDawn).lockMine();

      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.eruption([])
      );
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.lostShipment(1, DIAMOND)
      );
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.setStageVideos(0, [])
      );
    });

    it("should Remove all admins and set isLocked", async () => {
      const adminRole = await mineContract.DEFAULT_ADMIN_ROLE();
      expect(await mineContract.isLocked()).to.be.false;
      expect(await mineContract.hasRole(adminRole, admin.address)).to.be.true;
      const newAdminUsers = [user, diamondDawn];
      await Promise.all(
        newAdminUsers.map(async (user) => {
          await mineContract.grantRole(adminRole, user.address);
          expect(await mineContract.hasRole(adminRole, user.address)).to.be
            .true;
        })
      );
      expect(await mineContract.getRoleMemberCount(adminRole)).to.equal(3); // remove admins
      await mineContract.connect(diamondDawn).lockMine(); // remove admins
      expect(await mineContract.getRoleMemberCount(adminRole)).to.equal(0); // remove admins
      await Promise.all(
        [...newAdminUsers, admin].map(
          async (user) =>
            expect(await mineContract.hasRole(adminRole, user.address)).to.be
              .false
        )
      );
      expect(await mineContract.isLocked()).to.be.true;
    });
  });

  describe("getMetadata", () => {
    const tokenId = 1;
    let mineContract;
    let user;
    let admin;
    let diamondDawn;
    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      mineContract = diamondDawnMine;
      user = user1;
      admin = owner;
      diamondDawn = user2;
      await diamondDawnMine.connect(diamondDawn).initialize(333);
      await setAllVideoUrls(diamondDawnMine);
    });

    it("should REVERT when NOT diamond dawn", async () => {
      await expect(
        mineContract.connect(user).getMetadata(tokenId)
      ).to.be.revertedWith("Only DD");
    });

    it("should REVERT when token doesn't exist", async () => {
      await expect(
        mineContract.connect(diamondDawn).getMetadata(1)
      ).to.be.revertedWith("Don't exist");
    });

    it("is correct for enter mine", async () => {
      const tokenId = 1;
      await mineContract.connect(diamondDawn).enter(tokenId);
      await assertEnterMineMetadata(diamondDawn, mineContract, tokenId);
    });

    it("is correct for mine", async () => {
      await mineContract.eruption([DIAMOND]);
      const tokenId = 1;
      await mineContract.connect(diamondDawn).enter(tokenId);
      await mineContract.connect(diamondDawn).mine(tokenId);

      await assertRoughMetadata(diamondDawn, mineContract, tokenId, 1, DIAMOND);
    });

    it("is correct for cut", async () => {
      await mineContract.eruption([DIAMOND]);
      const tokenId = 1;
      await mineContract.connect(diamondDawn).enter(tokenId);
      await mineContract.connect(diamondDawn).mine(tokenId);
      await mineContract.connect(diamondDawn).cut(tokenId);

      // fetch metadata for token 1
      await assertCutMetadata(diamondDawn, mineContract, tokenId, 1, DIAMOND);
    });

    it("is correct for polish", async () => {
      await mineContract.eruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await mineContract.connect(diamondDawn).enter(tokenId);
      await mineContract.connect(diamondDawn).mine(tokenId);
      await mineContract.connect(diamondDawn).cut(tokenId);
      await mineContract.connect(diamondDawn).polish(tokenId);
      await assertPolishedMetadata(
        diamondDawn,
        mineContract,
        tokenId,
        1,
        DIAMOND
      );
    });

    it("is correct for rebirth", async () => {
      await mineContract.eruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await mineContract.connect(diamondDawn).enter(tokenId);
      await mineContract.connect(diamondDawn).mine(tokenId);
      await mineContract.connect(diamondDawn).cut(tokenId);
      await mineContract.connect(diamondDawn).polish(tokenId);
      await mineContract.connect(diamondDawn).ship(tokenId);
      await mineContract.connect(diamondDawn).rebirth(tokenId);
      const physicalTokenId = 1;
      await assertRebornMetadata(
        diamondDawn,
        mineContract,
        tokenId,
        physicalTokenId,
        DIAMOND
      );
    });
  });

  describe("isReady", () => {
    let mineContract;
    let diamondDawn;
    let admin;
    let user;
    const numDiamonds = 5;
    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      mineContract = diamondDawnMine;
      diamondDawn = user2;
      admin = owner;
      user = user1;
      await diamondDawnMine.connect(diamondDawn).initialize(numDiamonds);
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
