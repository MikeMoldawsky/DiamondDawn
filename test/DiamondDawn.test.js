/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { expect } = require("chai");
const { parseEther, parseUnits, formatEther } = require("ethers/lib/utils");
const { ethers, waffle } = require("hardhat");
const { BigNumber } = ethers;
const {
  advanceBlockTo,
  advanceTimeAndBlock,
  latest,
} = require("./utilities/time.js");

describe("DiamondDawn", () => {
  let diamondDawnContract;
  let provider;
  let owner, user1, user2, user3, user4;
  let user5, user6, user7, user8;

  // constants
  const ADMIN_ROLE =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const PAUSER_ROLE =
    "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a";
  const MINTER_ROLE =
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    provider = waffle.provider;
    owner = signers[0];
    user1 = signers[1];
    user2 = signers[2];
    user3 = signers[3];
    user4 = signers[4];

    user5 = signers[5];
    user6 = signers[6];
    user7 = signers[7];
    user8 = signers[8];

    const DiamondDawn = await ethers.getContractFactory("DiamondDawn");

    // deploying flava nft
    diamondDawnContract = await DiamondDawn.deploy("1000"); // royality as 10 %

    await diamondDawnContract.deployed();

    // console.log("flava nft package deployed at " + diamondDawnContract.address);
  });

  describe("Deployment", function () {
    it("Should be matching some configerations", async () => {
      expect(await diamondDawnContract.name()).to.equals("DiamondDawn");
      expect(await diamondDawnContract.symbol()).to.equals("DD");
    });

    it("Should set the right admin / maintainer / minter", async function () {
      const isAdmin = await diamondDawnContract.hasRole(
        ADMIN_ROLE,
        owner.address
      );
      expect(isAdmin).to.equal(true);

      const isPauser = await diamondDawnContract.hasRole(
        PAUSER_ROLE,
        owner.address
      );
      expect(isPauser).to.equal(true);

      const isMinter = await diamondDawnContract.hasRole(
        MINTER_ROLE,
        owner.address
      );
      expect(isMinter).to.equal(true);
    });
  });

  describe("Transactions", function () {
    beforeEach(async function () {
      await diamondDawnContract.unpause();
    });

    it("Should mint correctly", async function () {
      const tx = await diamondDawnContract.safeMint(owner.address);
      await tx.wait();
      const _balance = await diamondDawnContract.balanceOf(owner.address);
      expect(_balance).to.equal(1);
    });

    it("Should be minted by MINTER ROLE only with safemint function", async function () {
      await expect(diamondDawnContract.connect(user1).safeMint(owner.address))
        .to.be.reverted;
    });

    it("Should not able to transfer when paused", async function () {
      let tx, rc, event;
      tx = await diamondDawnContract.safeMint(owner.address);
      rc = await tx.wait();
      event = rc.events.find((event) => event.event === "Transfer");
      let [from, to, tokenId] = event.args;

      tx = await diamondDawnContract.pause();
      await tx.wait();

      await expect(
        diamondDawnContract.safeMint(owner.address)
      ).to.be.revertedWith("Pausable: paused");

      await expect(
        diamondDawnContract.transferFrom(owner.address, user1.address, tokenId)
      ).to.be.revertedWith("Pausable: paused");

      tx = await diamondDawnContract.unpause();
      await tx.wait();

      tx = await diamondDawnContract.safeMint(owner.address);
      await tx.wait();
    });

    it("should have a random shape on mined then cut", async function () {
      let allowlist = [user1.address, user2.address];
      await diamondDawnContract.revealStage("");
      await diamondDawnContract.addToAllowList(allowlist);
      await diamondDawnContract
        .connect(user1)
        .mine(1, { value: parseEther("0.4") });

      const balanceOfUser1 = await diamondDawnContract.balanceOf(user1.address);
      console.log(balanceOfUser1.toNumber());

      await diamondDawnContract.completeCurrentStage();

      let stage = await diamondDawnContract.stage();
      console.log(stage); // 1 equals to cut

      let user1CurrentShape = await diamondDawnContract.getShapeForToken(0);
      console.log(user1CurrentShape);
      expect(user1CurrentShape).to.equals(3); // 3 shape is undefined

      await diamondDawnContract.revealStage("");
      await diamondDawnContract.connect(user1).cut(0);

      user1CurrentShape = await diamondDawnContract.getShapeForToken(0);
      console.log(user1CurrentShape);
      expect(user1CurrentShape).to.not.equals(3); // 3 shape is undefined
    });
  });
});
