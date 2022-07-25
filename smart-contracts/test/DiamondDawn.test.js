/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { expect } = require("chai");
const { parseEther, parseUnits, formatEther } = require("ethers/lib/utils");
const { ethers, waffle } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = ethers;
const {
  advanceBlockTo,
  advanceTimeAndBlock,
  latest,
} = require("./utilities/time.js");

describe("DiamondDawn", () => {
  // constants
  const ADMIN_ROLE =
      "0x0000000000000000000000000000000000000000000000000000000000000000";

  async function deployDiamondDawnContractsFixture() {
    const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine");
    const diamondDawnMine = await DiamondDawnMine.deploy();
    const DiamondDawn = await ethers.getContractFactory("DiamondDawn");
    const diamondDawn = await DiamondDawn.deploy("1000", diamondDawnMine.address, []); // royality as 10 %
    const [owner, user1, user2, user3, user4, user5, user6, user7, user8] = await ethers.getSigners();
    const provider = waffle.provider;
    await diamondDawn.deployed();
    // Fixtures can return anything you consider useful for your tests
    return { DiamondDawn, diamondDawn, owner, user1, user2, user3, user4, user5, user6, user7, user8, provider };
  }

  describe("Deployment", function () {
    it("Should be matching some configurations", async () => {
      const { diamondDawn } = await loadFixture(deployDiamondDawnContractsFixture);
      expect(await diamondDawn.name()).to.equals("DiamondDawn");
      expect(await diamondDawn.symbol()).to.equals("DD");
    });

    it("Should set the right admin", async function () {
      const { owner, diamondDawn } = await loadFixture(deployDiamondDawnContractsFixture);
      const isAdmin = await diamondDawn.hasRole(
        ADMIN_ROLE,
        owner.address
      );
      expect(isAdmin).to.equal(true);
    });
  });

  describe("Transactions", function () {

    xit("Should mint correctly", async function () {
      const { owner, diamondDawn } = await loadFixture(deployDiamondDawnContractsFixture);
      await diamondDawn.unpause();
      const tx = await diamondDawn.safeMint(owner.address);
      await tx.wait();
      const _balance = await diamondDawn.balanceOf(owner.address);
      expect(_balance).to.equal(1);
    });

    xit("Should be minted by MINTER ROLE only with safemint function", async function () {
      const { owner, user1, diamondDawn } = await loadFixture(deployDiamondDawnContractsFixture);
      await diamondDawn.unpause();
      await expect(diamondDawn.connect(user1).safeMint(owner.address))
          .to.be.reverted;
    });

    xit("Should not able to transfer when paused", async function () {
      const { owner, user1, diamondDawn } = await loadFixture(deployDiamondDawnContractsFixture);
      await diamondDawn.unpause();
      let tx, rc, event;
      tx = await diamondDawn.safeMint(owner.address);
      rc = await tx.wait();
      event = rc.events.find((event) => event.event === "Transfer");
      let [from, to, tokenId] = event.args;

      tx = await diamondDawn.pause();
      await tx.wait();

      await expect(
        diamondDawn.safeMint(owner.address)
      ).to.be.revertedWith("Pausable: paused");

      await expect(
        diamondDawn.transferFrom(owner.address, user1.address, tokenId)
      ).to.be.revertedWith("Pausable: paused");

      tx = await diamondDawn.unpause();
      await tx.wait();

      tx = await diamondDawn.safeMint(owner.address);
      await tx.wait();
    });

    xit("should have a random shape on mined then cut", async function () {
      const { user1, user2, diamondDawn } = await loadFixture(deployDiamondDawnContractsFixture);
      await diamondDawn.unpause();
      const allowlist = [user1.address, user2.address];
      await diamondDawn.revealStage("");
      await diamondDawn.addToAllowList(allowlist);
      await diamondDawn
        .connect(user1)
        .mine(1, { value: parseEther("0.004") });

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
