require("dotenv").config();
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { SYSTEM_STAGE } = require("./utils/EnumConverterUtils");

// constants
const MAX_TOKENS = 333;

describe("DiamondDawn", () => {
  async function deployDDContract(maxDiamonds) {
    const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine");
    const diamondDawnMine = await DiamondDawnMine.deploy([]);
    const DiamondDawn = await ethers.getContractFactory("DiamondDawn");
    const diamondDawn = await DiamondDawn.deploy(
      diamondDawnMine.address,
      MAX_TOKENS
    );
    const [owner, user1, user2] = await ethers.getSigners();
    await diamondDawn.deployed();
    // Fixtures can return anything you consider useful for your tests
    return { diamondDawn, diamondDawnMine, owner, user1, user2 };
  }

  describe("Deployment", () => {
    let ddContract;
    let mineContract;
    let admin;
    let userA;
    let userB;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
        await loadFixture(deployDDContract);
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
      expect(await mineContract.isOpen()).to.be.true;
    });

    it("Should set system stage to INVITATIONS", async () => {
      expect(await ddContract.systemStage()).to.equal(SYSTEM_STAGE.INVITATIONS);
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
    // TODO: tests
  });

  describe("mine", () => {
    // TODO: tests
  });

  describe("cut", () => {
    // TODO: tests
  });

  describe("polish", () => {
    // TODO: tests
  });

  describe("ship", () => {
    // TODO: tests
  });

  describe("rebirth", () => {
    // TODO: tests
  });

  describe("getTokenIdsByOwner", () => {
    // TODO: tests
  });

  describe("getShippingTokenIds", () => {
    // TODO: tests
  });

  describe("Transactions", () => {
    xit("Should mint correctly", async function () {
      const { owner, diamondDawn } = await loadFixture(deployDDContract);
      await diamondDawn.unpause();
      const tx = await diamondDawn.safeMint(owner.address);
      await tx.wait();
      const _balance = await diamondDawn.balanceOf(owner.address);
      expect(_balance).to.equal(1);
    });

    xit("Should be minted by MINTER ROLE only with safemint function", async function () {
      const { owner, user1, diamondDawn } = await loadFixture(deployDDContract);
      await diamondDawn.unpause();
      await expect(diamondDawn.connect(user1).safeMint(owner.address)).to.be
        .reverted;
    });

    xit("Should not able to transfer when paused", async function () {
      const { owner, user1, diamondDawn } = await loadFixture(deployDDContract);
      await diamondDawn.unpause();
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
      const { user1, user2, diamondDawn } = await loadFixture(deployDDContract);
      await diamondDawn.unpause();
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
