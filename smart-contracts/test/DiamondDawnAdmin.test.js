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
  ALL_STAGES,
} = require("./utils/EnumConverterUtils");
const {
  assertPolishedMetadata,
  assertRebornMetadata,
  setAllVideoUrls,
} = require("./utils/MineTestUtils");
const { DIAMOND } = require("./utils/Diamonds");
const { assertOnlyAdmin } = require("./utils/AdminTestUtils");
const { deployMine } = require("./utils/DeployMineUtils");
const { deployDD, MAX_TOKENS } = require("./utils/DeployDDUtils");
const { signMessage } = require("./utils/SignatureUtils");

describe("Diamond Dawn Admin", () => {
  describe("Deployment", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;
    let adminSig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDD);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signMessage(signer, admin);
    });

    it("should grant admin permissions to deployer", async () => {
      const adminRole = await dd.DEFAULT_ADMIN_ROLE();
      expect(await dd.hasRole(adminRole, admin.address)).to.be.true;
      expect(await dd.hasRole(adminRole, dd.address)).to.be.false;
      expect(await dd.hasRole(adminRole, userA.address)).to.be.false;
      expect(await dd.hasRole(adminRole, userB.address)).to.be.false;
    });

    it("Should have correct ERC721 configurations", async () => {
      expect(await dd.name()).to.equals("DiamondDawn");
      expect(await dd.symbol()).to.equals("DD");
    });

    it("Should set and initialize DiamondDawnMine", async () => {
      expect(await ddMine.diamondDawn()).to.equal(dd.address);
      expect(await ddMine.maxDiamonds()).to.equal(MAX_TOKENS);
      expect(await ddMine.isInitialized()).to.be.true;
      expect(await ddMine.isLocked()).to.be.false;
    });

    it("Should correctly set public params", async () => {
      expect(await dd.PRICE()).to.equal(PRICE);
      expect(await dd.PRICE_WEDDING()).to.equal(PRICE_WEDDING);
      expect(await dd.MAX_ENTRANCE()).to.equal(MAX_TOKENS);
      // expect(await dd.MAX_ENTRANCE()).to.equal(333); // TODO: uncomment
      expect(await dd.isLocked()).to.be.false;
      expect(await dd.isActive()).to.be.false;
      expect(await dd.paused()).to.be.false;
      expect(await dd.stage()).to.equal(STAGE.NO_STAGE);
      expect(await dd.ddMine()).to.equal(ddMine.address);
    });

    it("Should set royalties to 10%", async () => {
      let [recipient, amount] = await dd.royaltyInfo(0, 100);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(10);
      [recipient, amount] = await dd.royaltyInfo(250, 330);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(33);
    });

    it("Should not allow to enter mine", async () => {
      await expect(dd.enter(adminSig, { value: PRICE })).to.be.revertedWith(
        "Wrong stage"
      );
      await expect(
        dd.enterWedding(adminSig, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Wrong stage");
    });
  });

  describe("withdraw", () => {
    it("should REVERT when NOT admin", async () => {
      // const unAuthUsers = [diamondDawn, user];
      // await Promise.all(
      //     unAuthUsers.map((unAuth) =>
      //         assertOnlyAdmin(unAuth, mineContract, (contract) =>
      //             contract.setStageVideos(STAGE.NO_STAGE, [])
      //         )
      //     )
      // );
    });

    it("should properly work", async () => {});

    it("should properly work when locked", async () => {});
  });

  describe("lockDiamondDawn", () => {
    it("should REVERT when NOT admin", async () => {});

    it("should REVERT if not DAWN stage", async () => {});

    it("should delegate lock to mine", async () => {});

    it("should disable all setter functions", async () => {});
  });

  describe("setStage", () => {
    it("should REVERT when NOT admin", async () => {});

    it("should REVERT when stage is not ready", async () => {});

    it("should REVERT when stage is active", async () => {});

    it("should REVERT when dd is locked", async () => {});

    it("should set active stage, emit event", async () => {});
  });

  describe("completeStage", () => {
    it("should REVERT when NOT admin", async () => {});

    it("should REVERT when NOT current system stage", async () => {});

    it("should REVERT when dd is locked", async () => {});

    it("should set isActive to false", async () => {});
  });

  describe("setRoyaltyInfo", () => {
    it("should REVERT when NOT admin", async () => {});

    it("should SUCCEED when dd is locked", async () => {});

    it("should change default royalties", async () => {});
  });

  describe("pause", () => {
    it("should REVERT when NOT admin", async () => {});

    it("should REVERT when dd is locked", async () => {});

    it("should set pause", async () => {});

    it("should lock from transfers", async () => {});
  });

  describe("unpause", () => {
    it("should REVERT when NOT admin", async () => {});

    it("should REVERT when dd is locked", async () => {});

    it("should set unpause", async () => {});

    it("should enable transfers", async () => {});
  });
});
