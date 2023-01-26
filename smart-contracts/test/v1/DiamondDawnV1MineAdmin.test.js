require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const _ = require("lodash");
const { STAGE, ALL_STAGES } = require("./utils/EnumConverterUtils");
const {
  assertPolishedMetadata,
  assertRebornMetadata,
  setAllManifests,
} = require("./utils/MineTestUtils");
const { DIAMOND } = require("./utils/Diamonds");
const { assertOnlyAdmin } = require("./utils/AdminTestUtils");
const { deployMine } = require("./utils/DeployMineUtils");

describe("Diamond Dawn Mine Admin", () => {
  describe("Deployed", () => {
    it("should grant admin permissions to deployer and set correct public defaults", async () => {
      const [owner, user1, user2] = await ethers.getSigners();
      const SerializerLib = await ethers.getContractFactory(
        "DiamondSerializer"
      );
      const serializer = await SerializerLib.deploy();
      const DiamondDawnMine = await ethers.getContractFactory(
        "DiamondDawnV1Mine",
        {
          libraries: {
            DiamondSerializer: serializer.address,
          },
        }
      );
      const diamondDawnMine = await DiamondDawnMine.deploy([]);
      await diamondDawnMine.deployed();
      const adminRole = await diamondDawnMine.DEFAULT_ADMIN_ROLE();
      expect(await diamondDawnMine.hasRole(adminRole, owner.address)).to.be
        .true;
      expect(await diamondDawnMine.hasRole(adminRole, user1.address)).to.be
        .false;
      expect(await diamondDawnMine.hasRole(adminRole, user2.address)).to.be
        .false;

      expect(await diamondDawnMine.isInitialized()).to.be.false;
      expect(await diamondDawnMine.isLocked()).to.be.false;
      expect(await diamondDawnMine.maxDiamonds()).equal(0);
      expect(await diamondDawnMine.diamondCount()).equal(0);
      expect(await diamondDawnMine.diamondDawn()).to.be.a.properAddress;
    });
  });

  describe("eruption", () => {
    const maxDiamonds = 15;
    let mineContract;
    let admin;
    let diamondDawn;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, users } = await loadFixture(deployMine);
      mineContract = diamondDawnMine;
      admin = owner;
      diamondDawn = users[0];
      user = users[1];
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.eruption([])
          )
        )
      );
    });

    it("should REVERT when EXCEEDS max diamonds", async () => {
      await mineContract.connect(diamondDawn).initialize(maxDiamonds);
      const maxDiamondsArray = _.range(maxDiamonds).map(() => DIAMOND);
      await mineContract.eruption(maxDiamondsArray);
      await expect(mineContract.eruption([DIAMOND])).to.be.revertedWith(
        "Mine overflow"
      );
      expect(await mineContract.diamondCount()).to.be.equal(maxDiamonds);
    });

    it("should REVERT after mine is locked", async () => {
      await mineContract.connect(diamondDawn).initialize(maxDiamonds);
      await mineContract.connect(diamondDawn).lockMine();
      const unAuthUsers = [diamondDawn, admin, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.eruption([DIAMOND])
          )
        )
      );
    });

    it("should SUCCESSFULLY insert 333 in 2 batches", async () => {
      const numDiamonds = 333;
      await mineContract.connect(diamondDawn).initialize(numDiamonds);
      const batches = [300, 33];
      for (const batch of batches) {
        const maxDiamondsArray = _.range(batch).map(() => DIAMOND);
        await mineContract.eruption(maxDiamondsArray);
      }
      expect(await mineContract.diamondCount()).to.be.equal(numDiamonds);
    });
  });

  describe("lostShipment", () => {
    const tokenId = 1;
    let mineContract;
    let admin;
    let diamondDawn;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, users } = await loadFixture(deployMine);
      mineContract = diamondDawnMine;
      admin = owner;
      diamondDawn = users[0];
      user = users[1];
      await diamondDawnMine.connect(diamondDawn).initialize(333);
      await setAllManifests(diamondDawnMine);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.lostShipment(1, DIAMOND)
          )
        )
      );
    });

    it("should REVERT when token doesn't exist", async () => {
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong shipment state"
      );
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.connect(diamondDawn).lockMine();
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.lostShipment(tokenId, DIAMOND)
      );
    });

    it("should REVERT when NOT POLISHED or REBORN", async () => {
      await mineContract.eruption([DIAMOND]);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong shipment state"
      );
      await mineContract.connect(diamondDawn).forge(tokenId);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong shipment state"
      );
      await mineContract.connect(diamondDawn).mine(tokenId);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong shipment state"
      );
      await mineContract.connect(diamondDawn).cut(tokenId);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong shipment state"
      );
      await mineContract.connect(diamondDawn).polish(tokenId);
      await assertPolishedMetadata(
        diamondDawn,
        mineContract,
        DIAMOND,
        tokenId,
        1,
        1,
        1,
        1,
        1,
        1
      );
      await mineContract.connect(diamondDawn).ship(tokenId);
      await assertPolishedMetadata(
        diamondDawn,
        mineContract,
        DIAMOND,
        tokenId,
        1,
        1,
        1,
        1,
        1,
        1
      );
      const replacedDiamond = { ...DIAMOND, points: DIAMOND.points + 10 };
      await mineContract.lostShipment(tokenId, replacedDiamond);
      await assertPolishedMetadata(
        diamondDawn,
        mineContract,
        replacedDiamond,
        tokenId,
        1,
        1,
        1,
        1,
        1,
        1
      );
      const replacedDiamond2 = {
        ...DIAMOND,
        points: DIAMOND.points + 20,
        shape: DIAMOND.shape + 1,
      };
      await mineContract.connect(diamondDawn).dawn(tokenId);
      await mineContract.lostShipment(tokenId, replacedDiamond2);
      await assertRebornMetadata(
        diamondDawn,
        mineContract,
        replacedDiamond2,
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

  describe("setManifest", () => {
    let mineContract;
    let admin;
    let diamondDawn;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, users } = await loadFixture(deployMine);
      mineContract = diamondDawnMine;
      admin = owner;
      diamondDawn = users[0];
      user = users[1];
      await diamondDawnMine.connect(diamondDawn).initialize(333);
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.setManifest(STAGE.NO_STAGE, "")
          )
        )
      );
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.connect(diamondDawn).lockMine();
      await Promise.all(
        ALL_STAGES.map((stage) =>
          assertOnlyAdmin(admin, mineContract, (contract) =>
            contract.setManifest(stage, "")
          )
        )
      );
    });

    it("should REVERT when no type url is locked", async () => {
      await expect(
        mineContract.setManifest(STAGE.NO_STAGE, "")
      ).to.be.revertedWithoutReason();
    });

    it("should SUCCESSFULLY set videos", async () => {
      const inviteManifest = "invite";
      const mineManifest = "mine";
      const cutManifest = "cut";
      const polishedManifest = "polished";
      const shipManifest = "dawn";

      await mineContract.setManifest(STAGE.KEY, inviteManifest);
      await mineContract.setManifest(STAGE.MINE, mineManifest);
      await mineContract.setManifest(STAGE.CUT, cutManifest);
      await mineContract.setManifest(STAGE.POLISH, polishedManifest);
      await mineContract.setManifest(STAGE.DAWN, shipManifest);

      expect(await mineContract.manifests(STAGE.KEY)).to.be.equal(
        inviteManifest
      );
      expect(await mineContract.manifests(STAGE.MINE)).to.be.equal(
        mineManifest
      );
      expect(await mineContract.manifests(STAGE.CUT)).to.be.equal(cutManifest);
      expect(await mineContract.manifests(STAGE.POLISH)).to.be.equal(
        polishedManifest
      );

      expect(await mineContract.manifests(STAGE.DAWN)).to.be.equal(
        shipManifest
      );
    });
  });
});
