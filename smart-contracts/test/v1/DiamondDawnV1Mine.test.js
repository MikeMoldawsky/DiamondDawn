require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const _ = require("lodash");
const { STAGE, ALL_STAGES } = require("../utils/EnumConverterUtils");
const {
  assertEnterMineMetadata,
  assertRoughMetadata,
  assertCutMetadata,
  assertPolishedMetadata,
  assertRebornMetadata,
} = require("../utils/MineTestUtils");
const { DIAMOND } = require("../utils/Diamonds");
const { assertOnlyAdmin } = require("../utils/AdminTestUtils");
const {
  deployMine,
  deployInitializedMine10WithVideos,
} = require("../utils/DeployMineUtils");

describe("Diamond Dawn Mine", () => {
  describe("initialized", () => {
    const maxDiamonds = 333;
    let ddMine;
    let admin;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, users } = await loadFixture(deployMine);
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
    });

    it("should correctly set dd, maxDiamonds, init & open", async () => {
      await ddMine.connect(user).initialize(maxDiamonds);
      expect(await ddMine.diamondDawn()).to.be.equal(user.address);
      expect(await ddMine.maxDiamonds()).to.be.equal(maxDiamonds);
      expect(await ddMine.isInitialized()).to.be.true;
      expect(await ddMine.isLocked()).to.be.false;
    });

    it("should REVERT when called more than once", async () => {
      await ddMine.connect(user).initialize(maxDiamonds);
      await expect(
        ddMine.connect(user).initialize(maxDiamonds)
      ).to.be.revertedWith("Initialized");
      await expect(ddMine.initialize(maxDiamonds)).to.be.revertedWith(
        "Initialized"
      );
    });
  });

  describe("forge", () => {
    const tokenId = 1;
    let ddMine;
    let dd;
    let admin;
    let user;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, users } = await loadFixture(
        deployInitializedMine10WithVideos
      );
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
    });

    it("should REVERT when NOT diamond dawn", async () => {
      await expect(ddMine.connect(user).forge(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is LOCKED", async () => {
      await ddMine.connect(dd).lockMine();
      await expect(ddMine.connect(dd).forge(tokenId)).to.be.revertedWith(
        "Locked"
      );
    });

    it("should REVERT when token EXISTS", async () => {
      await ddMine.connect(dd).forge(tokenId); // token exists
      await expect(ddMine.connect(dd).forge(tokenId)).to.be.revertedWith(
        "Can't process"
      );
    });

    it("should forge 4 keys and generate metadata", async () => {
      for (let i = 1; i < 5; i++) {
        await expect(ddMine.connect(dd).forge(i))
          .to.emit(ddMine, "Forge")
          .withArgs(i);
        await assertEnterMineMetadata(dd, ddMine, i);
      }
    });
  });

  describe("mine", () => {
    const tokenId = 1;
    let dd;
    let ddMine;
    let admin;
    let user;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, users } = await loadFixture(
        deployInitializedMine10WithVideos
      );
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(ddMine.connect(user).mine(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is locked", async () => {
      await ddMine.eruption([DIAMOND]);
      await ddMine.connect(dd).lockMine();
      await expect(ddMine.connect(dd).mine(tokenId)).to.be.revertedWith(
        "Locked"
      );
    });

    it("should REVERT when mine is DRY", async () => {
      await expect(ddMine.connect(dd).mine(tokenId)).to.be.revertedWith(
        "Dry mine"
      );
    });

    it("should REVERT when token is NOT invite type", async () => {
      await ddMine.eruption([DIAMOND]);
      await ddMine.eruption([DIAMOND]);
      await ddMine.connect(dd).forge(tokenId);
      await ddMine.connect(dd).mine(tokenId);
      await expect(ddMine.connect(dd).mine(tokenId)).to.be.revertedWith(
        "Can't process"
      );
    });

    it("should mine 4 tokens and generate metadata", async () => {
      // Prepare diamonds and invitations
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await ddMine.eruption([DIAMOND]);
          await ddMine.connect(dd).forge(i);
        })
      );
      for (let i = 1; i < 5; i++) {
        const tokenId = 5 - i;
        await expect(ddMine.connect(dd).mine(tokenId))
          .to.emit(ddMine, "Mine")
          .withArgs(tokenId);
        await assertRoughMetadata(dd, ddMine, DIAMOND, tokenId, i, i);
      }
    });
  });

  describe("cut", () => {
    const tokenId = 1;
    let dd;
    let ddMine;
    let admin;
    let user;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, users } = await loadFixture(
        deployInitializedMine10WithVideos
      );
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(ddMine.connect(user).cut(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is Locked", async () => {
      await ddMine.connect(dd).lockMine();
      await expect(ddMine.connect(dd).cut(tokenId)).to.be.revertedWith(
        "Locked"
      );
    });

    it("should REVERT when token is NOT rough type", async () => {
      await ddMine.eruption([DIAMOND]);
      await ddMine.connect(dd).forge(tokenId);
      await expect(ddMine.connect(dd).cut(tokenId)).to.be.revertedWith(
        "Can't process"
      );
      await ddMine.connect(dd).mine(tokenId);
      await ddMine.connect(dd).cut(tokenId);
      await expect(ddMine.connect(dd).cut(tokenId)).to.be.revertedWith(
        "Can't process"
      );
    });

    it("should cut 4 tokens and generate metadata", async () => {
      // Prepare diamonds and invitations
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await ddMine.eruption([DIAMOND]);
          await ddMine.connect(dd).forge(i);
          await ddMine.connect(dd).mine(i);
        })
      );

      for (let i = 1; i < 5; i++) {
        const tokenId = 5 - i;
        await expect(await ddMine.connect(dd).cut(tokenId))
          .to.emit(ddMine, "Cut")
          .withArgs(tokenId);
        await assertCutMetadata(dd, ddMine, DIAMOND, tokenId, tokenId, 4, i, i);
      }
    });
  });

  describe("polish", () => {
    const tokenId = 1;
    let dd;
    let ddMine;
    let admin;
    let user;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, users } = await loadFixture(
        deployInitializedMine10WithVideos
      );
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(ddMine.connect(user).polish(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when Locked", async () => {
      await ddMine.connect(dd).lockMine();
      await expect(ddMine.connect(dd).polish(tokenId)).to.be.revertedWith(
        "Locked"
      );
    });

    it("should REVERT when token is NOT cut type", async () => {
      await ddMine.eruption([DIAMOND]);
      await ddMine.connect(dd).forge(tokenId);
      await expect(ddMine.connect(dd).polish(tokenId)).to.be.revertedWith(
        "Can't process"
      );
      await ddMine.connect(dd).mine(tokenId);
      await expect(ddMine.connect(dd).polish(tokenId)).to.be.revertedWith(
        "Can't process"
      );
      await ddMine.connect(dd).cut(tokenId);
      await ddMine.connect(dd).polish(tokenId);
      await expect(ddMine.connect(dd).polish(tokenId)).to.be.revertedWith(
        "Can't process"
      );
    });

    it("should polish 4 tokens and generate metadata", async () => {
      // Prepare diamonds and invitations
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await ddMine.eruption([DIAMOND]);
          await ddMine.connect(dd).forge(i);
          await ddMine.connect(dd).mine(i);
          await ddMine.connect(dd).cut(i);
        })
      );
      for (let i = 1; i < 5; i++) {
        const tokenId = 5 - i;
        await expect(ddMine.connect(dd).polish(tokenId))
          .to.emit(ddMine, "Polish")
          .withArgs(tokenId);
        await assertPolishedMetadata(
          dd,
          ddMine,
          DIAMOND,
          tokenId,
          tokenId,
          4,
          tokenId,
          4,
          i,
          i
        );
      }
    });
  });

  describe("ship", () => {
    const tokenId = 1;
    let dd;
    let ddMine;
    let admin;
    let user;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, users } = await loadFixture(
        deployInitializedMine10WithVideos
      );
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(ddMine.connect(user).ship(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should REVERT when mine is Locked", async () => {
      await ddMine.connect(dd).lockMine();
      await expect(ddMine.connect(dd).ship(tokenId)).to.be.revertedWith(
        "Locked"
      );
    });

    it("should REVERT when token is NOT polish type", async () => {
      await ddMine.eruption([DIAMOND]);
      await ddMine.connect(dd).forge(tokenId);
      await expect(ddMine.connect(dd).ship(tokenId)).to.be.revertedWith(
        "Can't process"
      );
      await ddMine.connect(dd).mine(tokenId);
      await expect(ddMine.connect(dd).ship(tokenId)).to.be.revertedWith(
        "Can't process"
      );
      await ddMine.connect(dd).cut(tokenId);
      await expect(ddMine.connect(dd).ship(tokenId)).to.be.revertedWith(
        "Can't process"
      );
      await ddMine.connect(dd).polish(tokenId);
      await ddMine.connect(dd).ship(tokenId);
      await expect(ddMine.connect(dd).ship(tokenId)).to.be.revertedWith(
        "Shipped"
      );
    });

    it("should ship 4 tokens and generate metadata", async () => {
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await ddMine.eruption([DIAMOND]);
          await ddMine.connect(dd).forge(i);
          await ddMine.connect(dd).mine(i);
          await ddMine.connect(dd).cut(i);
        })
      );
      for (let i = 1; i < 5; i++) {
        const tokenId = 5 - i;
        await ddMine.connect(dd).polish(tokenId);
        await expect(ddMine.connect(dd).ship(tokenId))
          .to.emit(ddMine, "Ship")
          .withArgs(tokenId, i, DIAMOND.number);
        await assertPolishedMetadata(
          dd,
          ddMine,
          DIAMOND,
          tokenId,
          tokenId,
          4,
          tokenId,
          4,
          i,
          i
        );
      }
    });
  });

  describe("rebirth", () => {
    const tokenId = 1;
    let dd;
    let ddMine;
    let admin;
    let user;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, users } = await loadFixture(
        deployInitializedMine10WithVideos
      );
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
    });

    it("should REVERT when NOT DiamondDawn", async () => {
      await expect(ddMine.connect(user).dawn(tokenId)).to.be.revertedWith(
        "Only DD"
      );
    });

    it("should work when mine is locked", async () => {
      await ddMine.eruption([DIAMOND]);
      await ddMine.connect(dd).forge(1);
      await ddMine.connect(dd).mine(1);
      await ddMine.connect(dd).cut(1);
      await ddMine.connect(dd).polish(1);
      await ddMine.connect(dd).ship(1);
      await ddMine.connect(dd).lockMine();
      await ddMine.connect(dd).dawn(1);
    });

    it("should REVERT when not shipped", async () => {
      await ddMine.eruption([DIAMOND]);
      await ddMine.connect(dd).forge(tokenId);
      await expect(ddMine.connect(dd).dawn(tokenId)).to.be.revertedWith(
        "Not shipped"
      );
      await ddMine.connect(dd).mine(tokenId);
      await expect(ddMine.connect(dd).dawn(tokenId)).to.be.revertedWith(
        "Not shipped"
      );
      await ddMine.connect(dd).cut(tokenId);
      await expect(ddMine.connect(dd).dawn(tokenId)).to.be.revertedWith(
        "Not shipped"
      );
      await ddMine.connect(dd).polish(tokenId);
      await expect(ddMine.connect(dd).dawn(tokenId)).to.be.revertedWith(
        "Not shipped"
      );

      await ddMine.connect(dd).ship(tokenId);
      await expect(ddMine.connect(dd).ship(tokenId)).to.be.revertedWith(
        "Shipped"
      );

      await ddMine.connect(dd).dawn(tokenId);
      await expect(ddMine.connect(dd).dawn(tokenId)).to.be.revertedWith(
        "Wrong state"
      );
    });

    it("should ship 4 tokens and generate metadata", async () => {
      await Promise.all(
        _.range(1, 5).map(async (i) => {
          await ddMine.eruption([DIAMOND]);
          await ddMine.connect(dd).forge(i);
          await ddMine.connect(dd).mine(i);
          await ddMine.connect(dd).cut(i);
          await ddMine.connect(dd).polish(i);
        })
      );
      for (let i = 1; i < 5; i++) {
        const tokenId = 5 - i;
        await ddMine.connect(dd).ship(tokenId);
        await expect(ddMine.connect(dd).dawn(tokenId))
          .to.emit(ddMine, "Dawn")
          .withArgs(tokenId);
        await assertRebornMetadata(
          dd,
          ddMine,
          DIAMOND,
          tokenId,
          tokenId,
          4,
          tokenId,
          4,
          tokenId,
          4,
          i,
          i
        );
      }
    });
  });

  describe("lockMine", () => {
    let ddMine;
    let admin;
    let dd;
    let user;
    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, users } = await loadFixture(
        deployInitializedMine10WithVideos
      );
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
    });

    it("should REVERT when NOT Diamond Dawn", async () => {
      const unAuthUsers = [admin, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          expect(ddMine.connect(unAuth).lockMine()).to.be.revertedWith(
            "Only DD"
          )
        )
      );
      await ddMine.connect(dd).lockMine(); // works for diamond dawn
    });

    it("should LOCK all setters", async () => {
      await ddMine.connect(dd).lockMine();

      await assertOnlyAdmin(admin, ddMine, (contract) => contract.eruption([]));
      await assertOnlyAdmin(admin, ddMine, (contract) =>
        contract.lostShipment(1, DIAMOND)
      );
      await assertOnlyAdmin(admin, ddMine, (contract) =>
        contract.setManifest(0, "")
      );
    });

    it("should Remove all admins and set isLocked", async () => {
      const adminRole = await ddMine.DEFAULT_ADMIN_ROLE();
      expect(await ddMine.isLocked()).to.be.false;
      expect(await ddMine.hasRole(adminRole, admin.address)).to.be.true;
      const newAdminUsers = [user, dd];
      await Promise.all(
        newAdminUsers.map(async (user) => {
          await ddMine.grantRole(adminRole, user.address);
          expect(await ddMine.hasRole(adminRole, user.address)).to.be.true;
        })
      );
      expect(await ddMine.getRoleMemberCount(adminRole)).to.equal(3); // remove admins
      await ddMine.connect(dd).lockMine(); // remove admins
      expect(await ddMine.getRoleMemberCount(adminRole)).to.equal(0); // remove admins
      await Promise.all(
        [...newAdminUsers, admin].map(
          async (user) =>
            expect(await ddMine.hasRole(adminRole, user.address)).to.be.false
        )
      );
      expect(await ddMine.isLocked()).to.be.true;
    });
  });

  describe("getMetadata", () => {
    const tokenId = 1;
    let dd;
    let ddMine;
    let admin;
    let user;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, users } =
        await deployInitializedMine10WithVideos();
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
    });

    it("should REVERT when NOT diamond dawn", async () => {
      await expect(
        ddMine.connect(user).getMetadata(tokenId)
      ).to.be.revertedWith("Only DD");
    });

    it("should REVERT when token doesn't exist", async () => {
      await expect(ddMine.connect(dd).getMetadata(1)).to.be.revertedWith(
        "Don't exist"
      );
    });

    it("is correct for forge key", async () => {
      const tokenId = 1;
      await ddMine.connect(dd).forge(tokenId);
      await assertEnterMineMetadata(dd, ddMine, tokenId);
    });

    it("is correct for mine", async () => {
      await ddMine.eruption([DIAMOND]);
      const tokenId = 1;
      await ddMine.connect(dd).forge(tokenId);
      await ddMine.connect(dd).mine(tokenId);

      await assertRoughMetadata(dd, ddMine, DIAMOND, tokenId, 1, 1);
    });

    it("is correct for cut", async () => {
      await ddMine.eruption([DIAMOND]);
      const tokenId = 1;
      await ddMine.connect(dd).forge(tokenId);
      await ddMine.connect(dd).mine(tokenId);
      await ddMine.connect(dd).cut(tokenId);

      // fetch metadata for token 1
      await assertCutMetadata(dd, ddMine, DIAMOND, tokenId, 1, 1, 1, 1);
    });

    it("is correct for polish", async () => {
      await ddMine.eruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await ddMine.connect(dd).forge(tokenId);
      await ddMine.connect(dd).mine(tokenId);
      await ddMine.connect(dd).cut(tokenId);
      await ddMine.connect(dd).polish(tokenId);
      await assertPolishedMetadata(
        dd,
        ddMine,
        DIAMOND,
        tokenId,
        1,
        1,
        1,
        1,
        1,
        1
      );
    });

    it("is correct for rebirth", async () => {
      await ddMine.eruption([DIAMOND]);

      // Token 1 enters mine
      const tokenId = 1;
      await ddMine.connect(dd).forge(tokenId);
      await ddMine.connect(dd).mine(tokenId);
      await ddMine.connect(dd).cut(tokenId);
      await ddMine.connect(dd).polish(tokenId);
      await ddMine.connect(dd).ship(tokenId);
      await ddMine.connect(dd).dawn(tokenId);
      await assertRebornMetadata(
        dd,
        ddMine,
        DIAMOND,
        tokenId,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      );
    });
  });

  describe("isReady", () => {
    let ddMine;
    let diamondDawn;
    let admin;
    let user;
    const numDiamonds = 5;
    beforeEach(async () => {
      const { diamondDawnMine, owner, users } = await loadFixture(deployMine);
      ddMine = diamondDawnMine;
      admin = owner;
      user = users[0];
      diamondDawn = users[1];
      await diamondDawnMine.connect(diamondDawn).initialize(numDiamonds);
    });

    it("should be NOT READY for all stages except NO STAGE and COMPLETED", async () => {
      expect(await ddMine.isReady(STAGE.NO_STAGE)).to.be.true;
      expect(await ddMine.isReady(STAGE.COMPLETED)).to.be.true;
      const noReadyStages = _.without(
        ALL_STAGES,
        STAGE.NO_STAGE,
        STAGE.COMPLETED
      );
      for (const stage of noReadyStages) {
        expect(await ddMine.isReady(stage)).to.be.false;
      }
    });

    it("should be TRUE only for ENTER_MINE", async () => {
      expect(await ddMine.isReady(STAGE.KEY)).to.be.false;
      await ddMine.setManifest(STAGE.KEY, "hi.mp4");
      expect(await ddMine.isReady(STAGE.KEY)).to.be.true;
      const noReadyStages = _.without(
        ALL_STAGES,
        STAGE.NO_STAGE,
        STAGE.COMPLETED,
        STAGE.KEY
      );
      for (const stage of noReadyStages) {
        expect(await ddMine.isReady(stage)).to.be.false;
      }
    });

    it("should be TRUE only for ROUGH when video set and mine populated", async () => {
      expect(await ddMine.isReady(STAGE.MINE)).to.be.false;
      await ddMine.setManifest(STAGE.MINE, "1.mp4");
      expect(await ddMine.isReady(STAGE.MINE)).to.be.false;
      const diamonds = _.range(numDiamonds - 1).map((_) => DIAMOND);
      await ddMine.eruption(diamonds);
      expect(await ddMine.isReady(STAGE.MINE)).to.be.false;
      await ddMine.eruption([DIAMOND]); // now mine has all diamonds
      expect(await ddMine.isReady(STAGE.MINE)).to.be.true;
      const noReadyStages = _.without(
        ALL_STAGES,
        STAGE.NO_STAGE,
        STAGE.COMPLETED,
        STAGE.MINE
      );
      for (const stage of noReadyStages) {
        expect(await ddMine.isReady(stage)).to.be.false;
      }
    });

    it("should be TRUE only for CUT", async () => {
      expect(await ddMine.isReady(STAGE.CUT)).to.be.false;
      await ddMine.setManifest(STAGE.CUT, "1.mp4");
      expect(await ddMine.isReady(STAGE.CUT)).to.be.true;
      const noReadyStages = _.without(
        ALL_STAGES,
        STAGE.NO_STAGE,
        STAGE.COMPLETED,
        STAGE.CUT
      );
      for (const stage of noReadyStages) {
        expect(await ddMine.isReady(stage)).to.be.false;
      }
    });

    it("should be TRUE only for POLISHED", async () => {
      expect(await ddMine.isReady(STAGE.POLISH)).to.be.false;
      await ddMine.setManifest(STAGE.POLISH, "1.mp4");
      expect(await ddMine.isReady(STAGE.POLISH)).to.be.true;
      const noReadyStages = _.without(
        ALL_STAGES,
        STAGE.NO_STAGE,
        STAGE.COMPLETED,
        STAGE.POLISH
      );
      for (const stage of noReadyStages) {
        expect(await ddMine.isReady(stage)).to.be.false;
      }
    });

    it("should be TRUE only for REBORN", async () => {
      expect(await ddMine.isReady(STAGE.DAWN)).to.be.false;
      await ddMine.setManifest(STAGE.DAWN, "hi.mp4");
      expect(await ddMine.isReady(STAGE.DAWN)).to.be.true;
      const noReadyStages = _.without(
        ALL_STAGES,
        STAGE.NO_STAGE,
        STAGE.COMPLETED,
        STAGE.DAWN
      );
      for (const stage of noReadyStages) {
        expect(await ddMine.isReady(stage)).to.be.false;
      }
    });

    it("should always be TRUE for COMPLETED", async () => {
      expect(await ddMine.isReady(STAGE.COMPLETED)).to.be.true;
      await ddMine.setManifest(STAGE.COMPLETED, "");
      expect(await ddMine.isReady(STAGE.COMPLETED)).to.be.true;
    });

    it("should revert if non existing stage", async () => {
      await expect(
        ddMine.isReady(ALL_STAGES.length)
      ).to.be.revertedWithoutReason();
    });
  });
});
