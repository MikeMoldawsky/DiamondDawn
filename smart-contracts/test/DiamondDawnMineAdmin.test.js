require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const _ = require("lodash");
const {
  NO_SHAPE_NUM,
  DIAMOND_DAWN_TYPE,
  SHAPE,
  ROUGH_SHAPE,
} = require("./utils/EnumConverterUtils");
const {
  assertPolishedMetadata,
  assertRebornMetadata,
  setAllVideoUrls,
} = require("./utils/MetadataTestUtils");

const DIAMOND = {
  number: 1111111111,
  date: 1659254421,
  shape: 1,
  points: 45,
  color: 2,
  clarity: 1,
  cut: 1,
  polish: 1,
  symmetry: 1,
  fluorescence: 1,
  measurements: "5.1 - 5.12 x 35",
};

async function assertOnlyAdmin(unAuthUser, mineContract, unAuthFunction) {
  const adminRole = await mineContract.DEFAULT_ADMIN_ROLE();
  return expect(
    unAuthFunction(mineContract.connect(unAuthUser))
  ).to.be.revertedWith(
    `AccessControl: account ${unAuthUser.address.toLowerCase()} is missing role ${adminRole}`
  );
}

describe("Diamond Dawn Mine Admin", () => {
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

  describe("eruption", () => {
    const maxDiamonds = 15;
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
      diamondDawn = user1;
      user = user2;
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
      await mineContract.initialize(diamondDawn.address, maxDiamonds);
      const maxDiamondsArray = _.range(maxDiamonds).map(() => DIAMOND);
      await mineContract.eruption(maxDiamondsArray);
      await expect(mineContract.eruption([DIAMOND])).to.be.revertedWith(
        "Mine overflow"
      );
      expect(await mineContract.diamondCount()).to.be.equal(maxDiamonds);
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.setOpen(false);
      await mineContract.lockMine();
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.eruption([DIAMOND])
      );
    });

    it("should SUCCESSFULLY insert 333 diamonds", async () => {
      // TODO - check if we can make it to 333 after optimizations (currently the txn gas limit is 30,395,800)
      const prodDiamondsSize = 200;
      await mineContract.initialize(diamondDawn.address, prodDiamondsSize);
      const maxDiamondsArray = _.range(prodDiamondsSize).map(() => DIAMOND);
      await mineContract.eruption(maxDiamondsArray);
      expect(await mineContract.diamondCount()).to.be.equal(prodDiamondsSize);
    });
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
      await diamondDawnMine.initialize(user2.address, 5);
      mineContract = diamondDawnMine;
      admin = owner;
      user = user1;
      diamondDawn = user2;
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.lockMine()
          )
        )
      );
    });

    it("should REVERT when mine is open", async () => {
      await mineContract.setOpen(true);
      await expect(mineContract.lockMine()).to.be.revertedWith("Mine Open");
    });

    it("should LOCK all setters", async () => {
      await mineContract.setOpen(false);
      await mineContract.lockMine();

      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.eruption([])
      );
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.lockMine()
      );
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.lostShipment(1, DIAMOND)
      );
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.setOpen(true)
      );
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.setTypeVideos(0, [])
      );
    });
  });

  describe("lostShipment", () => {
    const tokenId = 1;
    let mineContract;
    let admin;
    let diamondDawn;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      await diamondDawnMine.initialize(owner.address, 333);
      await setAllVideoUrls(diamondDawnMine);
      mineContract = diamondDawnMine;
      admin = owner;
      diamondDawn = user1;
      user = user2;
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
        "Wrong type"
      );
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.setOpen(false);
      await mineContract.lockMine();
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.lostShipment(tokenId, DIAMOND)
      );
    });

    it("should REVERT when NOT POLISHED or REBORN", async () => {
      await mineContract.eruption([DIAMOND]);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong type"
      );
      await mineContract.enter(tokenId);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong type"
      );
      await mineContract.mine(tokenId);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong type"
      );
      await mineContract.cut(tokenId);
      await expect(mineContract.lostShipment(1, DIAMOND)).to.be.revertedWith(
        "Wrong type"
      );
      await mineContract.polish(tokenId);
      await assertPolishedMetadata(mineContract, tokenId, 1, DIAMOND);
      await mineContract.ship(tokenId);
      await assertPolishedMetadata(mineContract, tokenId, 1, DIAMOND);
      const replacedDiamond = { ...DIAMOND, points: DIAMOND.points + 10 };
      await mineContract.lostShipment(tokenId, replacedDiamond);
      await assertPolishedMetadata(mineContract, tokenId, 1, replacedDiamond);
      const replacedDiamond2 = {
        ...DIAMOND,
        points: DIAMOND.points + 20,
        shape: DIAMOND.shape + 1,
      };
      const rebornId = 1;
      await mineContract.rebirth(tokenId);
      await mineContract.lostShipment(tokenId, replacedDiamond2);
      await assertRebornMetadata(
        mineContract,
        tokenId,
        rebornId,
        replacedDiamond2
      );
    });
  });

  describe("setOpen", () => {
    let mineContract;
    let admin;
    let diamondDawn;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      await diamondDawnMine.initialize(owner.address, 333);
      admin = owner;
      mineContract = diamondDawnMine;
      diamondDawn = user1;
      user = user2;
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.setOpen(true)
          )
        )
      );
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.setOpen(false);
      await mineContract.lockMine();
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.setOpen(true)
      );
      await assertOnlyAdmin(admin, mineContract, (contract) =>
        contract.setOpen(false)
      );
    });

    it("should SUCCESSFULLY set isOpen", async () => {
      await mineContract.setOpen(true);
      expect(await mineContract.isOpen()).to.be.true;
      await mineContract.setOpen(false);
      expect(await mineContract.isOpen()).to.be.false;
      await mineContract.setOpen(true);
      expect(await mineContract.isOpen()).to.be.true;
    });
  });

  describe("setTypeVideos", () => {
    let mineContract;
    let admin;
    let diamondDawn;
    let user;

    beforeEach(async () => {
      const { diamondDawnMine, owner, user1, user2 } = await loadFixture(
        deployMineContract
      );
      await diamondDawnMine.initialize(owner.address, 333);
      mineContract = diamondDawnMine;
      admin = owner;
      diamondDawn = user1;
      user = user2;
    });

    it("should REVERT when NOT admin", async () => {
      const unAuthUsers = [diamondDawn, user];
      await Promise.all(
        unAuthUsers.map((unAuth) =>
          assertOnlyAdmin(unAuth, mineContract, (contract) =>
            contract.setTypeVideos(DIAMOND_DAWN_TYPE.NO_TYPE, [])
          )
        )
      );
    });

    it("should REVERT when mine is locked", async () => {
      await mineContract.setOpen(false);
      await mineContract.lockMine();
      const types = [
        DIAMOND_DAWN_TYPE.NO_TYPE,
        DIAMOND_DAWN_TYPE.ENTER_MINE,
        DIAMOND_DAWN_TYPE.ROUGH,
        DIAMOND_DAWN_TYPE.CUT,
        DIAMOND_DAWN_TYPE.POLISHED,
        DIAMOND_DAWN_TYPE.REBORN,
      ];

      await Promise.all(
        types.map((type) =>
          assertOnlyAdmin(admin, mineContract, (contract) =>
            contract.setTypeVideos(type, [])
          )
        )
      );
    });

    it("should REVERT when no type url is locked", async () => {
      await expect(
        mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.NO_TYPE, [])
      ).to.be.revertedWithoutReason();
    });
    it("should REVERT when video is empty", async () => {
      await expect(
        mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ENTER_MINE, [
          { shape: NO_SHAPE_NUM, video: "" },
        ])
      ).to.be.revertedWithoutReason();
      await expect(
        mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ROUGH, [
          { shape: ROUGH_SHAPE.MAKEABLE_1, video: "a" },
          { shape: ROUGH_SHAPE.MAKEABLE_2, video: "" },
        ])
      ).to.be.revertedWithoutReason();
    });

    it("should SUCCESSFULLY set videos", async () => {
      const enterMine = "infinity.mp4";
      const roughMakeable1 = "rough_1.mp4";
      const roughMakeable2 = "rough_2.mp4";
      // cut
      const cutPear = "cut_pear.mp4";
      const cutRound = "cut_round.mp4";
      const cutOval = "cut_oval.mp4";
      const cutRadiant = "cut_radiant.mp4";
      // polished
      const polishedPear = "polished_pear.mp4";
      const polishedRound = "polished_round.mp4";
      const polishedOval = "polished_oval.mp4";
      const polishedRadiant = "polished_radiant.mp4";
      // reborn
      const rebornVideo = "diamond_dawn.mp4";

      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ENTER_MINE, [
        { shape: NO_SHAPE_NUM, video: enterMine },
      ]);
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.ROUGH, [
        { shape: ROUGH_SHAPE.MAKEABLE_1, video: roughMakeable1 },
        { shape: ROUGH_SHAPE.MAKEABLE_2, video: roughMakeable2 },
      ]);

      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.CUT, [
        { shape: SHAPE.PEAR, video: cutPear },
        { shape: SHAPE.ROUND, video: cutRound },
        { shape: SHAPE.OVAL, video: cutOval },
        { shape: SHAPE.RADIANT, video: cutRadiant },
      ]);
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.POLISHED, [
        { shape: SHAPE.PEAR, video: polishedPear },
        { shape: SHAPE.ROUND, video: polishedRound },
        { shape: SHAPE.OVAL, video: polishedOval },
        { shape: SHAPE.RADIANT, video: polishedRadiant },
      ]);
      await mineContract.setTypeVideos(DIAMOND_DAWN_TYPE.REBORN, [
        { shape: NO_SHAPE_NUM, video: rebornVideo },
      ]);

      // await mineContract.setOpen(true);
      expect(
        await mineContract.typeToShapeVideo(DIAMOND_DAWN_TYPE.ENTER_MINE, 0)
      ).to.be.equal(enterMine);

      expect(
        await mineContract.typeToShapeVideo(
          DIAMOND_DAWN_TYPE.ROUGH,
          ROUGH_SHAPE.MAKEABLE_1
        )
      ).to.be.equal(roughMakeable1);
      expect(
        await mineContract.typeToShapeVideo(
          DIAMOND_DAWN_TYPE.ROUGH,
          ROUGH_SHAPE.MAKEABLE_2
        )
      ).to.be.equal(roughMakeable2);

      expect(
        await mineContract.typeToShapeVideo(DIAMOND_DAWN_TYPE.CUT, SHAPE.PEAR)
      ).to.be.equal(cutPear);
      expect(
        await mineContract.typeToShapeVideo(DIAMOND_DAWN_TYPE.CUT, SHAPE.ROUND)
      ).to.be.equal(cutRound);
      expect(
        await mineContract.typeToShapeVideo(DIAMOND_DAWN_TYPE.CUT, SHAPE.OVAL)
      ).to.be.equal(cutOval);
      expect(
        await mineContract.typeToShapeVideo(
          DIAMOND_DAWN_TYPE.CUT,
          SHAPE.RADIANT
        )
      ).to.be.equal(cutRadiant);

      expect(
        await mineContract.typeToShapeVideo(
          DIAMOND_DAWN_TYPE.POLISHED,
          SHAPE.PEAR
        )
      ).to.be.equal(polishedPear);
      expect(
        await mineContract.typeToShapeVideo(
          DIAMOND_DAWN_TYPE.POLISHED,
          SHAPE.ROUND
        )
      ).to.be.equal(polishedRound);
      expect(
        await mineContract.typeToShapeVideo(
          DIAMOND_DAWN_TYPE.POLISHED,
          SHAPE.OVAL
        )
      ).to.be.equal(polishedOval);
      expect(
        await mineContract.typeToShapeVideo(
          DIAMOND_DAWN_TYPE.POLISHED,
          SHAPE.RADIANT
        )
      ).to.be.equal(polishedRadiant);

      expect(
        await mineContract.typeToShapeVideo(DIAMOND_DAWN_TYPE.REBORN, 0)
      ).to.be.equal(rebornVideo);
    });
  });
});
