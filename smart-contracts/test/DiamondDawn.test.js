require("dotenv").config();
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { STAGE, ROUGH_SHAPE, SHAPE } = require("./utils/EnumConverterUtils");
const {
  setCutVideos,
  setPolishedVideos,
  setRebornVideo,
} = require("./utils/MineTestUtils");
const {
  deployDD,
  deployDDWithMineRoughReady,
  deployDDWithMineCutReady,
  deployDDWithMinePolishReady,
  MAX_TOKENS,
} = require("./utils/DeployContractTestUtils");

async function completeAndSetStage(ddContract, stage) {
  await ddContract.completeStage(await ddContract.stage());
  await ddContract.setStage(stage);
}

const PRICE = parseEther("0.002");

describe("DiamondDawn", () => {
  describe("Deployment", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
        await loadFixture(deployDD);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = user1;
      userB = user2;
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
      expect(await dd.ddMine()).to.equal(ddMine.address);
      expect(await ddMine.diamondDawn()).to.equal(dd.address);
      expect(await ddMine.maxDiamonds()).to.equal(MAX_TOKENS);
      expect(await ddMine.isInitialized()).to.be.true;
      expect(await ddMine.isLocked()).to.be.false;
    });

    it("Should set system stage to NO STAGE", async () => {
      expect(await dd.stage()).to.equal(STAGE.NO_STAGE);
    });

    it("Should set royalties to 10%", async () => {
      let [recipient, amount] = await dd.royaltyInfo(0, 100);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(10);
      [recipient, amount] = await dd.royaltyInfo(250, 330);
      expect(recipient).to.equal(admin.address);
      expect(amount).to.equal(33);
    });
  });

  describe("enter", () => {
    // TODO: tests - important
  });

  describe("mine", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
        await loadFixture(deployDDWithMineRoughReady);
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = user1;
      userB = user2;
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await expect(dd.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await setCutVideos(ddMine);
      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await setPolishedVideos(ddMine);
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await setRebornVideo(ddMine);
      await completeAndSetStage(dd, STAGE.SHIP);
      await expect(dd.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId); // success
    });

    it("Should REVERT when mine is not ready", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      // transform mine to be not ready
      await ddMine.setStageVideos(STAGE.MINE, [
        { shape: ROUGH_SHAPE.MAKEABLE_1, video: "" },
      ]);
      await expect(dd.mine(tokenId)).to.be.revertedWith(`Stage not ready`);
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.mine(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.mine(tokenId)).to.be.revertedWith("Not owner");
      await expect(dd.connect(userB).mine(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await dd.connect(userA).mine(tokenId);
    });

    it("Should REVERT when wrong token stage", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.mine(tokenId));
      await expect(dd.mine(tokenId)).to.be.revertedWith("Wrong stage");
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.mine(tokenId)).to.emit(ddMine, "Mine").withArgs(tokenId);
    });
  });

  describe("cut", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
        await loadFixture(deployDDWithMineCutReady);
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = user1;
      userB = user2;
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.mine(tokenId);

      await setPolishedVideos(ddMine);
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await setRebornVideo(ddMine);
      await completeAndSetStage(dd, STAGE.SHIP);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId); // success
    });

    it("Should REVERT when Cut is not ready", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.CUT);
      // transform mine to be not ready
      await ddMine.setStageVideos(STAGE.CUT, [
        { shape: SHAPE.RADIANT, video: "" },
      ]);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Stage not ready");
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.cut(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);

      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Not owner");
      await expect(dd.connect(userB).cut(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await dd.connect(userA).cut(tokenId);
    });

    it("Should REVERT when wrong token stage", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.cut(tokenId)).to.emit(ddMine, "Cut").withArgs(tokenId);
    });
  });

  describe("polish", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
        await loadFixture(deployDDWithMinePolishReady);
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = user1;
      userB = user2;
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.cut(tokenId); // success

      await completeAndSetStage(dd, STAGE.POLISH);
      dd.polish(tokenId);

      await setRebornVideo(ddMine);
      await completeAndSetStage(dd, STAGE.SHIP);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");
    });

    it("Should REVERT when polish is not ready", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.POLISH);
      // transform polish to be not ready
      await ddMine.setStageVideos(STAGE.POLISH, [
        { shape: SHAPE.RADIANT, video: "" },
      ]);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Stage not ready");
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.polish(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.connect(userA).cut(tokenId);

      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Not owner");
      await expect(dd.connect(userB).polish(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await dd.connect(userA).polish(tokenId);
    });

    it("Should REVERT when wrong token stage", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await dd.enter({ value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.polish(tokenId))
        .to.emit(ddMine, "Polish")
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
