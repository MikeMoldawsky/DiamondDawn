require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const {
  deployDD,
  NUM_TOKENS,
  deployDDWithRebirthReady,
} = require("./utils/DeployDDUtils");
const { signForgeMessage } = require("./utils/SignatureUtils");
const { assertOnlyAdmin } = require("./utils/AdminTestUtils");
const { PRICE_MARRIAGE, PRICE } = require("./utils/Consts");
const { STAGE, ALL_STAGES } = require("./utils/EnumConverterUtils");
const { ethers } = require("hardhat");
const { completeAndSetStage } = require("./utils/DDTestUtils");
const _ = require("lodash");

async function lockDiamondDawn(dd) {
  await dd.completeStage(await dd.stage());
  await dd.setStage(STAGE.COMPLETED);
  await dd.lockDiamondDawn();
}

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
      adminSig = signForgeMessage(signer, admin);
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
      expect(await ddMine.maxDiamonds()).to.equal(NUM_TOKENS);
      expect(await ddMine.isInitialized()).to.be.true;
      expect(await ddMine.isLocked()).to.be.false;
    });

    it("Should correctly set public params", async () => {
      expect(await dd.PRICE()).to.equal(PRICE);
      expect(await dd.PRICE_MARRIAGE()).to.equal(PRICE_MARRIAGE);
      expect(await dd.MAX_ENTRANCE()).to.equal(NUM_TOKENS);
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

    it("Should not allow to forge key", async () => {
      await expect(dd.forge(adminSig, { value: PRICE })).to.be.revertedWith(
        "Wrong stage"
      );
      await expect(
        dd.forgeWithPartner(adminSig, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Wrong stage");
    });
  });

  describe("setStage", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithRebirthReady);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [userA, userB];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, dd, (contract) =>
            contract.setStage(STAGE.KEY)
          )
        )
      );
      await dd.setStage(STAGE.KEY); // success
    });

    it("should REVERT when stage is active", async () => {
      await dd.setStage(STAGE.KEY);
      expect(await dd.isActive()).to.be.true;
      await expect(dd.setStage(STAGE.MINE)).to.revertedWith("Stage is active");
    });

    it("should REVERT when mine stage is not ready", async () => {
      await dd.setStage(STAGE.KEY); // work
      await dd.completeStage(STAGE.KEY);
      await ddMine.setManifest(STAGE.KEY, "");
      await expect(dd.setStage(STAGE.KEY)).to.revertedWith("Mine not ready");
    });

    it("should REVERT when dd is locked", async () => {
      await lockDiamondDawn(dd);
      expect(await dd.isLocked()).to.be.true;
      await expect(dd.setStage(STAGE.MINE)).to.revertedWith("Locked forever");
    });

    it("should set active stage, emit event", async () => {
      for (const stage of ALL_STAGES) {
        await expect(dd.setStage(stage))
          .to.emit(dd, "StageChanged")
          .withArgs(stage);
        expect(await dd.isActive()).to.be.true;
        expect(await dd.stage()).to.equal(stage);
        await dd.completeStage(stage);
      }
    });
  });

  describe("completeStage", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithRebirthReady);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
      await dd.setStage(STAGE.KEY);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [userA, userB];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, dd, (contract) =>
            contract.completeStage(STAGE.KEY)
          )
        )
      );
      await dd.completeStage(STAGE.KEY); // success
    });

    it("should REVERT when dd is locked", async () => {
      await lockDiamondDawn(dd);
      expect(await dd.isLocked()).to.be.true;
      await expect(dd.completeStage(STAGE.KEY)).to.revertedWith(
        "Locked forever"
      );
    });

    it("should REVERT when NOT current system stage", async () => {
      expect(await dd.stage()).to.equal(STAGE.KEY);
      await expect(dd.completeStage(STAGE.MINE)).to.revertedWith("Wrong stage");
      await dd.completeStage(STAGE.KEY); // success
    });

    it("should set isActive to false", async () => {
      expect(await dd.isActive()).to.be.true;
      await dd.completeStage(STAGE.KEY); // success
      expect(await dd.stage()).to.equal(STAGE.KEY);
      expect(await dd.isActive()).to.be.false;
    });
  });

  describe("lockDiamondDawn", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithRebirthReady);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
      await dd.setStage(STAGE.KEY);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [userA, userB];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, dd, (contract) => contract.lockDiamondDawn())
        )
      );
      await lockDiamondDawn(dd); // success
    });

    it("should REVERT when dd is locked", async () => {
      await lockDiamondDawn(dd);
      expect(await dd.isLocked()).to.be.true;
      await expect(dd.lockDiamondDawn()).to.revertedWith("Locked forever");
    });

    it("should REVERT if not COMPLETED stage", async () => {
      for (const stage of _.without(ALL_STAGES, STAGE.COMPLETED)) {
        await dd.completeStage(await dd.stage());
        await dd.setStage(stage);
        expect(await dd.stage()).to.equal(stage);
        await expect(dd.lockDiamondDawn()).to.revertedWith("Not Completed");
      }
    });

    it("should delegate lock to mine", async () => {
      expect(await dd.isLocked()).to.be.false;
      expect(await ddMine.isLocked()).to.be.false;
      await lockDiamondDawn(dd);
      expect(await dd.isLocked()).to.be.true;
      expect(await ddMine.isLocked()).to.be.true;
    });

    it("should disable all setter functions except withdraw & royalties", async () => {
      await lockDiamondDawn(dd);
      await expect(dd.setStage(STAGE.KEY)).to.revertedWith("Locked forever");
      await expect(dd.completeStage(STAGE.KEY)).to.revertedWith(
        "Locked forever"
      );
      await expect(dd.lockDiamondDawn()).to.revertedWith("Locked forever");
      await expect(dd.pause()).to.revertedWith("Locked forever");
      await expect(dd.unpause()).to.revertedWith("Locked forever");
      await dd.withdraw(); // success
      await dd.setRoyaltyInfo(admin.address, 500); // success
    });
  });

  describe("pause", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithRebirthReady);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
      await dd.setStage(STAGE.KEY);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [userA, userB];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, dd, (contract) => contract.pause())
        )
      );
      await dd.pause(); // success
    });

    it("should REVERT when dd is locked", async () => {
      await lockDiamondDawn(dd);
      expect(await dd.isLocked()).to.be.true;
      await expect(dd.pause()).to.revertedWith("Locked forever");
    });

    it("should correctly set paused", async () => {
      expect(await dd.paused()).to.be.false;
      await dd.pause();
      expect(await dd.paused()).to.be.true;
    });

    it("should lock from transfers", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      expect(await dd.balanceOf(admin.address)).to.equal(1);
      await dd.pause();
      await expect(
        dd.transferFrom(admin.address, userA.address, tokenId)
      ).to.revertedWith("Pausable: paused");
      expect(await dd.balanceOf(admin.address)).to.equal(1);
    });
  });

  describe("unpause", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithRebirthReady);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
      await dd.setStage(STAGE.KEY);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [userA, userB];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, dd, (contract) => contract.unpause())
        )
      );
      await dd.pause(); // success
      await dd.unpause(); // success
    });

    it("should REVERT when dd is locked", async () => {
      await lockDiamondDawn(dd);
      expect(await dd.isLocked()).to.be.true;
      await expect(dd.unpause()).to.revertedWith("Locked forever");
    });

    it("should correctly set paused", async () => {
      await dd.pause();
      expect(await dd.paused()).to.be.true;
      await dd.unpause();
      expect(await dd.paused()).to.be.false;
    });

    it("should enable transfers", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      expect(await dd.balanceOf(admin.address)).to.equal(1);
      await dd.pause();
      await expect(
        dd.transferFrom(admin.address, userA.address, tokenId)
      ).to.revertedWith("Pausable: paused");

      await dd.unpause();
      await dd.transferFrom(admin.address, userA.address, tokenId);
      expect(await dd.balanceOf(admin.address)).to.equal(0);
      expect(await dd.balanceOf(userA.address)).to.equal(1);
    });
  });

  describe("setRoyaltyInfo", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithRebirthReady);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
      await dd.setStage(STAGE.KEY);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [userA, userB];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, dd, (contract) =>
            contract.setRoyaltyInfo(admin.address, 500)
          )
        )
      );
      await dd.setRoyaltyInfo(admin.address, 500);
    });

    it("should SUCCEED when dd is locked", async () => {
      await lockDiamondDawn(dd);
      expect(await dd.isLocked()).to.be.true;
      await dd.setRoyaltyInfo(admin.address, 500); // success
    });

    it("should correctly set 10% default royalties", async () => {
      let [recipient, amount] = await dd.royaltyInfo(0, 100);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(10);
      [recipient, amount] = await dd.royaltyInfo(250, 330);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(33);
    });

    it("should change default royalties", async () => {
      await dd.setRoyaltyInfo(admin.address, 500); // 5%
      let [recipient, amount] = await dd.royaltyInfo(0, 100);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(5); // 5%
      [recipient, amount] = await dd.royaltyInfo(250, 220);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(11);
    });
  });

  describe("withdraw", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithRebirthReady);
      await diamondDawn.setStage(STAGE.KEY);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [userA, userB];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, dd, (contract) => contract.withdraw())
        )
      );
      await dd.withdraw(); // success
    });

    it("should properly work", async () => {
      expect(await ethers.provider.getBalance(dd.address)).to.equal(0);
      await dd.forge(adminSig, { value: PRICE });
      expect(await ethers.provider.getBalance(dd.address)).to.equal(PRICE);
      // await expect(() => dd.withdraw()).to.changeEtherBalances(
      //   [dd, admin],
      //   [-PRICE, PRICE]
      // );
      await dd.withdraw();
      expect(await ethers.provider.getBalance(dd.address)).to.equal(0);
    });

    it("should properly work when locked", async () => {
      expect(await ethers.provider.getBalance(dd.address)).to.equal(0);
      await dd.forge(adminSig, { value: PRICE });
      await dd
        .connect(userA)
        .forgeWithPartner(userASig, { value: PRICE_MARRIAGE });
      const expectedBalance = PRICE.add(PRICE_MARRIAGE);
      expect(await ethers.provider.getBalance(dd.address)).to.equal(
        expectedBalance
      );

      await completeAndSetStage(dd, STAGE.COMPLETED);
      await dd.completeStage(STAGE.COMPLETED);
      await dd.lockDiamondDawn();

      expect(await dd.stage()).to.equal(STAGE.COMPLETED);
      expect(await dd.isActive()).to.be.false;
      expect(await dd.isLocked()).to.be.true;
      // await expect(() => dd.withdraw()).to.changeEtherBalances(
      //   [dd, admin],
      //   [-expectedBalance, expectedBalance]
      // );
      await dd.withdraw();
      expect(await ethers.provider.getBalance(dd.address)).to.equal(0);
    });
  });
});
