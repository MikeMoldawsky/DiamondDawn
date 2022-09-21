require("dotenv").config();
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { STAGE, ROUGH_SHAPE, SHAPE } = require("./utils/EnumConverterUtils");
const {
  prepareRoughReady,
  setCutVideos,
  setPolishedVideos,
  setRebornVideo,
  prepareCutReady,
  preparePolishReady,
} = require("./utils/MineTestUtils");
const { deployDD } = require("./utils/DeployContractTestUtils");

// constants
const MAX_TOKENS = 10;

async function deployDDWithMineRoughReady() {
  const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
    await deployDD();
  await prepareRoughReady(diamondDawnMine, MAX_TOKENS);
  return { diamondDawn, diamondDawnMine, owner, user1, user2 };
}

async function deployDDWithMineCutReady() {
  const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
    await deployDD();
  await prepareCutReady(diamondDawnMine, MAX_TOKENS);
  return { diamondDawn, diamondDawnMine, owner, user1, user2 };
}

async function deployDDWithMinePolishReady() {
  const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
    await deployDD();
  await preparePolishReady(diamondDawnMine, MAX_TOKENS);
  return { diamondDawn, diamondDawnMine, owner, user1, user2 };
}

async function completeAndSetStage(ddContract, stage) {
  await ddContract.completeStage(await ddContract.stage());
  await ddContract.setStage(stage);
}

const PRICE = parseEther("0.002");

describe("DiamondDawn", () => {
  describe("Deployment", () => {
    let ddContract;
    let mineContract;
    let admin;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
        await loadFixture(deployDD);
      ddContract = diamondDawn;
      mineContract = diamondDawnMine;
      admin = owner;
      userA = user1;
      userB = user2;
    });

    it("should grant admin permissions to deployer", async () => {
      const adminRole = await ddContract.DEFAULT_ADMIN_ROLE();
      expect(await ddContract.hasRole(adminRole, admin.address)).to.be.true;
      expect(await ddContract.hasRole(adminRole, ddContract.address)).to.be
        .false;
      expect(await ddContract.hasRole(adminRole, userA.address)).to.be.false;
      expect(await ddContract.hasRole(adminRole, userB.address)).to.be.false;
    });

    it("Should have correct ERC721 configurations", async () => {
      expect(await ddContract.name()).to.equals("DiamondDawn");
      expect(await ddContract.symbol()).to.equals("DD");
    });

    it("Should set and initialize DiamondDawnMine", async () => {
      expect(await ddContract.ddMine()).to.equal(mineContract.address);
      expect(await mineContract.diamondDawn()).to.equal(ddContract.address);
      expect(await mineContract.maxDiamonds()).to.equal(MAX_TOKENS);
      expect(await mineContract.isInitialized()).to.be.true;
      expect(await mineContract.isLocked()).to.be.false;
    });

    it("Should set system stage to NO STAGE", async () => {
      expect(await ddContract.stage()).to.equal(STAGE.NO_STAGE);
    });

    it("Should set royalties to 10%", async () => {
      let [recipient, amount] = await ddContract.royaltyInfo(0, 100);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(10);
      [recipient, amount] = await ddContract.royaltyInfo(250, 330);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(33);
    });
  });

  describe("enter", () => {
    // TODO: tests - important
  });

  describe("mine", () => {
    let ddContract;
    let mineContract;
    let admin;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
        await loadFixture(deployDDWithMineRoughReady);
      await diamondDawn.setStage(STAGE.INVITE);
      ddContract = diamondDawn;
      mineContract = diamondDawnMine;
      admin = owner;
      userA = user1;
      userB = user2;
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await expect(ddContract.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await setCutVideos(mineContract);
      await completeAndSetStage(ddContract, STAGE.CUT);
      await expect(ddContract.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await setPolishedVideos(mineContract);
      await completeAndSetStage(ddContract, STAGE.POLISH);
      await expect(ddContract.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await setRebornVideo(mineContract);
      await completeAndSetStage(ddContract, STAGE.SHIP);
      await expect(ddContract.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(ddContract, STAGE.MINE);
      await ddContract.mine(tokenId); // success
    });

    it("Should REVERT when mine is not ready", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.MINE);
      // transform mine to be not ready
      await mineContract.setStageVideos(STAGE.MINE, [
        { shape: ROUGH_SHAPE.MAKEABLE_1, video: "" },
      ]);
      await expect(ddContract.mine(tokenId)).to.be.revertedWith(
        `Stage not ready`
      );
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(ddContract, STAGE.MINE);
      await expect(ddContract.mine(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await ddContract.connect(userA).enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.MINE);
      await expect(ddContract.mine(tokenId)).to.be.revertedWith("Not owner");
      await expect(ddContract.connect(userB).mine(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await ddContract.connect(userA).mine(tokenId);
    });

    it("Should REVERT when wrong token stage", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.MINE);
      await expect(ddContract.mine(tokenId));
      await expect(ddContract.mine(tokenId)).to.be.revertedWith("Wrong stage");
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.MINE);
      await expect(ddContract.mine(tokenId))
        .to.emit(mineContract, "Mine")
        .withArgs(tokenId);
    });
  });

  describe("cut", () => {
    let ddContract;
    let mineContract;
    let admin;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
        await loadFixture(deployDDWithMineCutReady);
      await diamondDawn.setStage(STAGE.INVITE);
      ddContract = diamondDawn;
      mineContract = diamondDawnMine;
      admin = owner;
      userA = user1;
      userB = user2;
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await expect(ddContract.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(ddContract, STAGE.MINE);
      await expect(ddContract.cut(tokenId)).to.be.revertedWith("Wrong stage");
      await ddContract.mine(tokenId);

      await setPolishedVideos(mineContract);
      await completeAndSetStage(ddContract, STAGE.POLISH);
      await expect(ddContract.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await setRebornVideo(mineContract);
      await completeAndSetStage(ddContract, STAGE.SHIP);
      await expect(ddContract.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(ddContract, STAGE.CUT);
      await ddContract.cut(tokenId); // success
    });

    it("Should REVERT when Cut is not ready", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.CUT);
      // transform mine to be not ready
      await mineContract.setStageVideos(STAGE.CUT, [
        { shape: SHAPE.RADIANT, video: "" },
      ]);
      await expect(ddContract.cut(tokenId)).to.be.revertedWith(
        "Stage not ready"
      );
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(ddContract, STAGE.CUT);
      await expect(ddContract.cut(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await ddContract.connect(userA).enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.MINE);
      await ddContract.connect(userA).mine(tokenId);

      await completeAndSetStage(ddContract, STAGE.CUT);
      await expect(ddContract.cut(tokenId)).to.be.revertedWith("Not owner");
      await expect(ddContract.connect(userB).cut(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await ddContract.connect(userA).cut(tokenId);
    });

    it("Should REVERT when wrong token stage", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.CUT);
      await expect(ddContract.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(ddContract, STAGE.MINE);
      await ddContract.mine(tokenId);
      await completeAndSetStage(ddContract, STAGE.CUT);
      await ddContract.cut(tokenId);
      await expect(ddContract.cut(tokenId)).to.be.revertedWith("Wrong stage");
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.MINE);
      await ddContract.mine(tokenId);
      await completeAndSetStage(ddContract, STAGE.CUT);
      await expect(ddContract.cut(tokenId))
        .to.emit(mineContract, "Cut")
        .withArgs(tokenId);
    });
  });

  describe("polish", () => {
    let ddContract;
    let mineContract;
    let admin;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
        await loadFixture(deployDDWithMinePolishReady);
      await diamondDawn.setStage(STAGE.INVITE);
      ddContract = diamondDawn;
      mineContract = diamondDawnMine;
      admin = owner;
      userA = user1;
      userB = user2;
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await expect(ddContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );

      await completeAndSetStage(ddContract, STAGE.MINE);
      await ddContract.mine(tokenId);
      await expect(ddContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );

      await completeAndSetStage(ddContract, STAGE.CUT);
      await expect(ddContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );
      await ddContract.cut(tokenId); // success

      await completeAndSetStage(ddContract, STAGE.POLISH);
      ddContract.polish(tokenId);

      await setRebornVideo(mineContract);
      await completeAndSetStage(ddContract, STAGE.SHIP);
      await expect(ddContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );
    });

    it("Should REVERT when polish is not ready", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.POLISH);
      // transform polish to be not ready
      await mineContract.setStageVideos(STAGE.POLISH, [
        { shape: SHAPE.RADIANT, video: "" },
      ]);
      await expect(ddContract.polish(tokenId)).to.be.revertedWith(
        "Stage not ready"
      );
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(ddContract, STAGE.POLISH);
      await expect(ddContract.polish(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await ddContract.connect(userA).enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.MINE);
      await ddContract.connect(userA).mine(tokenId);
      await completeAndSetStage(ddContract, STAGE.CUT);
      await ddContract.connect(userA).cut(tokenId);

      await completeAndSetStage(ddContract, STAGE.POLISH);
      await expect(ddContract.polish(tokenId)).to.be.revertedWith("Not owner");
      await expect(
        ddContract.connect(userB).polish(tokenId)
      ).to.be.revertedWith("Not owner");
      await ddContract.connect(userA).polish(tokenId);
    });

    it("Should REVERT when wrong token stage", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.POLISH);
      await expect(ddContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );

      await completeAndSetStage(ddContract, STAGE.MINE);
      await ddContract.mine(tokenId);
      await completeAndSetStage(ddContract, STAGE.POLISH);
      await expect(ddContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );

      await completeAndSetStage(ddContract, STAGE.CUT);
      await ddContract.cut(tokenId);
      await completeAndSetStage(ddContract, STAGE.POLISH);
      await ddContract.polish(tokenId);
      await expect(ddContract.polish(tokenId)).to.be.revertedWith(
        "Wrong stage"
      );
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await ddContract.enter({ value: PRICE });
      await completeAndSetStage(ddContract, STAGE.MINE);
      await ddContract.mine(tokenId);
      await completeAndSetStage(ddContract, STAGE.CUT);
      await ddContract.cut(tokenId);
      await completeAndSetStage(ddContract, STAGE.POLISH);
      await expect(ddContract.polish(tokenId))
        .to.emit(mineContract, "Polish")
        .withArgs(tokenId);
    });
  });

  describe("ship", () => {
    // TODO: tests - important
  });

  describe("rebirth", () => {
    // TODO: tests - important
  });

  describe("getTokenIdsByOwner", () => {
    // TODO: tests
  });

  describe("getShippingTokenIds", () => {
    // TODO: tests
  });

  describe("Transactions", () => {
    xit("Should mint correctly", async function () {
      const { owner, diamondDawn } = await loadFixture(deployDD);
      const tx = await diamondDawn.safeMint(owner.address);
      await tx.wait();
      const _balance = await diamondDawn.balanceOf(owner.address);
      expect(_balance).to.equal(1);
    });

    xit("Should be minted by MINTER ROLE only with safemint function", async function () {
      const { owner, user1, diamondDawn } = await loadFixture(deployDD);
      await expect(diamondDawn.connect(user1).safeMint(owner.address)).to.be
        .reverted;
    });

    xit("Should not able to transfer when paused", async function () {
      const { owner, user1, diamondDawn } = await loadFixture(deployDD);
      let tx, rc, event;
      tx = await diamondDawn.safeMint(owner.address);
      rc = await tx.wait();
      event = rc.events.find((event) => event.event === "Transfer");
      const [from, to, tokenId] = event.args;

      tx = await diamondDawn.pause();
      await tx.wait();

      await expect(diamondDawn.safeMint(owner.address)).to.be.revertedWith(
        "Pausable: paused"
      );

      await expect(
        diamondDawn.transferFrom(owner.address, user1.address, tokenId)
      ).to.be.revertedWith("Pausable: paused");

      tx = await diamondDawn.unpause();
      await tx.wait();

      tx = await diamondDawn.safeMint(owner.address);
      await tx.wait();
    });

    xit("should have a random shape on mined then cut", async function () {
      const { user1, user2, diamondDawn } = await loadFixture(deployDD);
      const allowlist = [user1.address, user2.address];
      await diamondDawn.revealStage("");
      await diamondDawn.addToAllowList(allowlist);
      await diamondDawn.connect(user1).mine(1, { value: parseEther("0.004") });

      const balanceOfUser1 = await diamondDawn.balanceOf(user1.address);
      console.log(balanceOfUser1.toNumber());

      await diamondDawn.completeCurrentStage();

      const stage = await diamondDawn.stage();
      console.log(stage); // 1 equals to cut

      let user1CurrentShape = await diamondDawn.getShapeForToken(0);
      console.log(user1CurrentShape);
      expect(user1CurrentShape).to.equals(3); // 3 shape is undefined

      await diamondDawn.revealStage("");
      await diamondDawn.connect(user1).cut(0);

      user1CurrentShape = await diamondDawn.getShapeForToken(0);
      console.log(user1CurrentShape);
      expect(user1CurrentShape).to.not.equals(3); // 3 shape is undefined
    });
  });
});
