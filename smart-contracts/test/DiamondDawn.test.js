require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const {
  STAGE,
  ROUGH_SHAPE,
  SHAPE,
  ALL_STAGES,
  NO_SHAPE_NUM,
} = require("./utils/EnumConverterUtils");
const {
  setCutVideos,
  setPolishedVideos,
  setRebornVideo,
  assertBase64AndGetParsed,
  BASE_URI,
} = require("./utils/MineTestUtils");
const {
  deployDD,
  deployDDWithMineReady,
  deployDDWithCutReady,
  deployDDWithPolishReady,
  MAX_TOKENS,
  deployDDWithRebirthReady,
} = require("./utils/DeployDDUtils");
const { signMessage } = require("./utils/SignatureUtils");
const _ = require("lodash");
const { ethers } = require("hardhat");
const { PRICE, PRICE_WEDDING } = require("./utils/Consts");
const { completeAndSetStage } = require("./utils/DDTestUtils");

describe("DiamondDawn", () => {
  describe("enter and enterWedding", () => {
    let dd;
    let ddMine;
    let admin;
    let user;
    let signer1;
    let adminSig;
    let userSig;
    let users1;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithRebirthReady);
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users.pop();
      signer1 = signer;
      adminSig = signMessage(signer, admin);
      userSig = signMessage(signer, user);
      users1 = users;
    });

    it("Should REVERT when price is wrong", async () => {
      await expect(
        dd.enter(adminSig, { value: PRICE.add(parseEther("0.0001")) })
      ).to.be.revertedWith(`Cost is: ${PRICE.toString()}`);
      await expect(
        dd.enter(adminSig, { value: PRICE.sub(parseEther("0.0001")) })
      ).to.be.revertedWith(`Cost is: ${PRICE.toString()}`);

      await expect(
        dd.enterWedding(adminSig, { value: PRICE.add(parseEther("0.0001")) })
      ).to.be.revertedWith(`Cost is: ${PRICE_WEDDING.toString()}`);
      await expect(
        dd.enterWedding(adminSig, { value: PRICE.sub(parseEther("0.0001")) })
      ).to.be.revertedWith(`Cost is: ${PRICE_WEDDING.toString()}`);
    });

    it("Should REVERT when not INVITE stage", async () => {
      const notAllowedStages = _.without(ALL_STAGES, STAGE.INVITE);
      for (const stage of notAllowedStages) {
        await completeAndSetStage(dd, stage);
        expect(await dd.stage()).to.equal(stage);
        await expect(dd.enter(adminSig, { value: PRICE })).to.be.revertedWith(
          "Wrong stage"
        );
        await expect(
          dd.enterWedding(adminSig, { value: PRICE_WEDDING })
        ).to.be.revertedWith("Wrong stage");
      }
    });

    it("Should REVERT when stage is NOT active", async () => {
      await dd.completeStage(STAGE.INVITE);
      expect(await dd.stage()).to.equal(STAGE.INVITE);
      expect(await dd.isActive()).to.be.false;
      await expect(dd.enter(adminSig, { value: PRICE })).to.be.revertedWith(
        "Stage is inactive"
      );
      await expect(
        dd.enterWedding(adminSig, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Stage is inactive");
    });

    it("Should REVERT when mine is full", async () => {
      await Promise.all(
        _.range(MAX_TOKENS).map(async (i) => {
          const signature = await signMessage(signer1, users1[i]);
          return await dd.connect(users1[i]).enter(signature, { value: PRICE });
        })
      );
      await expect(dd.enter(adminSig, { value: PRICE })).to.be.revertedWith(
        "Max capacity"
      );
      await expect(
        dd.enterWedding(adminSig, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Max capacity");
    });

    it("Should REVERT when mine is NOT READY", async () => {
      // transform mine to be not ready
      await ddMine.setStageVideos(STAGE.INVITE, [
        { shape: NO_SHAPE_NUM, video: "" },
      ]);
      await expect(dd.enter(adminSig, { value: PRICE })).to.be.revertedWith(
        "Stage not ready"
      );

      await expect(
        dd.enterWedding(adminSig, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Stage not ready");
    });

    // TODO: should enable before production
    xit("Should REVERT when trying to mine more than once", async () => {
      await dd.enter(adminSig, { value: PRICE });
      await expect(dd.enter(adminSig, { value: PRICE })).to.be.revertedWith(
        "Already minted"
      );
      await expect(
        dd.enterWedding(adminSig, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Already minted");
      // test enter wedding
      await dd.connect(user).enterWedding(userSig, { value: PRICE_WEDDING });
      await expect(
        dd.connect(user).enter(userSig, { value: PRICE })
      ).to.be.revertedWith("Already minted");
      await expect(
        dd.connect(user).enterWedding(userSig, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Already minted");
    });

    it("Should REVERT when using wrong address signature", async () => {
      await expect(dd.enter(userSig, { value: PRICE })).to.be.revertedWith(
        "Not allowed to mint"
      );
      await expect(
        dd.enterWedding(userSig, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Not allowed to mint");
    });

    it("Should REVERT when message is signed by another signer", async () => {
      const signedMessage = signMessage(admin, admin);
      await expect(
        dd.enter(signedMessage, { value: PRICE })
      ).to.be.revertedWith("Not allowed to mint");
      await expect(
        dd.enterWedding(signedMessage, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Not allowed to mint");
    });

    it("Should REVERT when using another address signed message", async () => {
      await expect(dd.enter(userSig, { value: PRICE })).to.be.revertedWith(
        "Not allowed to mint"
      );
      await expect(
        dd.enterWedding(userSig, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Not allowed to mint");
    });

    it("Should REVERT when signed with a wrong message", async () => {
      const signature = signer1.signMessage("that's a wrong message");
      await expect(dd.enter(signature, { value: PRICE })).to.be.revertedWith(
        "Not allowed to mint"
      );
      await expect(
        dd.enterWedding(signature, { value: PRICE_WEDDING })
      ).to.be.revertedWith("Not allowed to mint");
    });

    it("Should cost 3.33 and add it to contract's balance", async () => {
      expect(await ethers.provider.getBalance(dd.address)).to.equal(0);
      await dd.enter(adminSig, { value: PRICE });
      expect(await ethers.provider.getBalance(dd.address)).to.equal(PRICE);
      await dd.connect(user).enterWedding(userSig, { value: PRICE_WEDDING });
      expect(await ethers.provider.getBalance(dd.address)).to.equal(
        PRICE.add(PRICE_WEDDING)
      );
    });

    it("Should mint to owner, emit events & have the right token ID", async () => {
      await expect(dd.connect(user).enter(userSig, { value: PRICE }))
        .to.emit(dd, "Transfer")
        .withArgs("0x0000000000000000000000000000000000000000", user.address, 1)
        .to.emit(ddMine, "Enter")
        .withArgs(1);
      await expect(
        dd.connect(admin).enterWedding(adminSig, { value: PRICE_WEDDING })
      )
        .to.emit(dd, "Transfer")
        .withArgs(
          "0x0000000000000000000000000000000000000000",
          admin.address,
          2
        )
        .to.emit(ddMine, "Enter")
        .withArgs(2);
      expect(await dd.ownerOf(1)).to.be.equal(user.address);
      expect(await dd.ownerOf(2)).to.be.equal(admin.address);
      expect(await dd.balanceOf(user.address)).to.equal(1);
      expect(await dd.balanceOf(admin.address)).to.equal(1);
    });
  });

  describe("mine", () => {
    let dd;
    let ddMine;
    let admin;
    let userA;
    let userB;
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithMineReady);
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signMessage(signer, admin);
      userASig = signMessage(signer, userA);
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.mine(tokenId)).to.be.revertedWith("Not owner");
      await expect(dd.connect(userB).mine(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await dd.connect(userA).mine(tokenId);
    });

    it("Should REVERT when not token owner after transfer", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      expect(await dd.balanceOf(userA.address)).to.equal(1);
      await dd
        .connect(userA)
        .transferFrom(userA.address, userB.address, tokenId);
      expect(await dd.balanceOf(userA.address)).to.equal(0);
      await expect(dd.connect(userA).mine(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await dd.connect(userB).mine(tokenId);
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
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

    it("Should REVERT when stage is NOT active", async () => {
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.completeStage(STAGE.MINE);
      expect(await dd.stage()).to.equal(STAGE.MINE);
      expect(await dd.isActive()).to.be.false;
      await expect(dd.mine(1)).to.be.revertedWith("Stage is inactive");
    });

    it("Should REVERT when mine is not ready", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
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

    it("Should REVERT when can NOT process token", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.mine(tokenId));
      await expect(dd.mine(tokenId)).to.be.revertedWith("Can't process");
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
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
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithCutReady);
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signMessage(signer, admin);
      userASig = signMessage(signer, userA);
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);

      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Not owner");
      await expect(dd.connect(userB).cut(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await dd.connect(userA).cut(tokenId);
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
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

    it("Should REVERT when stage is NOT active", async () => {
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(1);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.completeStage(STAGE.CUT);
      expect(await dd.stage()).to.equal(STAGE.CUT);
      expect(await dd.isActive()).to.be.false;
      await expect(dd.cut(1)).to.be.revertedWith("Stage is inactive");
    });

    it("Should REVERT when Cut is not ready", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
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

    it("Should REVERT when can NOT process token", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Can't process");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Can't process");
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
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
    let adminSig;
    let userASig;

    beforeEach(async () => {
      const { diamondDawn, diamondDawnMine, owner, signer, users } =
        await loadFixture(deployDDWithPolishReady);
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signMessage(signer, admin);
      userASig = signMessage(signer, userA);
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter(userASig, { value: PRICE });
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

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.cut(tokenId); // success

      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);

      await setRebornVideo(ddMine);
      await completeAndSetStage(dd, STAGE.SHIP);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");
    });

    it("Should REVERT when stage is NOT active", async () => {
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(1);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(1);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.completeStage(STAGE.POLISH);
      expect(await dd.stage()).to.equal(STAGE.POLISH);
      expect(await dd.isActive()).to.be.false;
      await expect(dd.polish(1)).to.be.revertedWith("Stage is inactive");
    });

    it("Should REVERT when polish is not ready", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
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

    it("Should REVERT when can NOT process token", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Can't process");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Can't process");

      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Can't process");
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
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
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signMessage(signer, admin);
      userASig = signMessage(signer, userA);
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.connect(userA).cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.connect(userA).polish(tokenId);

      await completeAndSetStage(dd, STAGE.SHIP);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Not owner");
      await expect(dd.connect(userB).ship(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await dd.connect(userA).ship(tokenId);
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await expect(dd.ship(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId); // success
      await expect(dd.ship(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });

    it("Should REVERT when stage is NOT active", async () => {
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(1);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(1);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(1);
      await completeAndSetStage(dd, STAGE.SHIP);

      await dd.completeStage(STAGE.SHIP);
      expect(await dd.stage()).to.equal(STAGE.SHIP);
      expect(await dd.isActive()).to.be.false;
      await expect(dd.ship(1)).to.be.revertedWith("Stage is inactive");
    });

    it("Should REVERT when ship is not ready", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.SHIP);
      // transform ship to be not ready
      await ddMine.setStageVideos(STAGE.SHIP, [
        { shape: NO_SHAPE_NUM, video: "" },
      ]);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Stage not ready");
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(dd, STAGE.SHIP);
      await expect(dd.ship(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });

    it("Should REVERT when can NOT process token", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.SHIP);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Can't process");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Can't process");

      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Can't process");

      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);
      await expect(dd.ship(tokenId)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );

      await dd.rebirth(tokenId);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Can't process");
    });

    it("Should BURN and Delegate to mine", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.connect(userA).cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.connect(userA).polish(tokenId);

      await completeAndSetStage(dd, STAGE.SHIP);
      expect(await dd.ownerOf(1)).to.be.equal(userA.address);
      expect(await dd.balanceOf(userA.address)).to.equal(1);
      expect(await dd.totalSupply()).to.equal(1);
      await expect(dd.connect(userA).ship(tokenId))
        .to.emit(dd, "Transfer")
        .withArgs(
          userA.address,
          "0x0000000000000000000000000000000000000000",
          1
        )
        .and.to.emit(ddMine, "Ship")
        .withArgs(tokenId, 1, 1111111111);
      expect(await dd.balanceOf(userA.address)).to.equal(0);
      await expect(dd.ownerOf(1)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
      expect(await dd.totalSupply()).to.equal(0);
    });
  });

  describe("rebirth", () => {
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
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signMessage(signer, admin);
      userASig = signMessage(signer, userA);
    });

    it("Should REVERT when not SHIP stage", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });

      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.mine(tokenId);

      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.cut(tokenId);

      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.polish(tokenId);

      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);

      await dd.rebirth(tokenId); // success
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("No shipment");
    });

    it("Should REVERT when not DAWN stage", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });

      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.mine(tokenId);

      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.cut(tokenId);

      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.polish(tokenId);

      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);

      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.rebirth(tokenId); // success
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("No shipment");
    });

    it("Should REVERT when not shipped", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter(userASig, { value: PRICE });

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);

      await completeAndSetStage(dd, STAGE.CUT);
      await dd.connect(userA).cut(tokenId);

      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.connect(userA).polish(tokenId);

      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.connect(userA).ship(tokenId);

      await expect(dd.rebirth(tokenId)).to.be.revertedWith("No shipment");
      await expect(dd.connect(userB).rebirth(tokenId)).to.be.revertedWith(
        "No shipment"
      );
      await dd.connect(userA).rebirth(tokenId);
    });

    it("Should REVERT when ship stage not ready", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);

      // transform ship to be not ready
      await ddMine.setStageVideos(STAGE.SHIP, [
        { shape: NO_SHAPE_NUM, video: "" },
      ]);
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("Ship not ready");
    });

    it("Should REBIRTH when SHIP stage is not active", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);

      await dd.completeStage(STAGE.SHIP);
      expect(await dd.stage()).to.equal(STAGE.SHIP);
      expect(await dd.isActive()).to.be.false;
      await dd.rebirth(tokenId); // success
    });

    it("Should REBIRTH when DAWN stage is not active", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.completeStage(STAGE.DAWN);

      expect(await dd.stage()).to.equal(STAGE.DAWN);
      expect(await dd.isActive()).to.be.false;
      await dd.rebirth(tokenId); // success
    });

    it("Should REVERT when rebirth more than once", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);
      await dd.rebirth(tokenId); // success
      await completeAndSetStage(dd, STAGE.DAWN);
      await expect(dd.rebirth(tokenId)).to.be.revertedWith("No shipment");
    });

    it("Should REVERT when trying to rebirth another user token or with wrong tokenId", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);

      await expect(dd.connect(userA).rebirth(tokenId)).to.be.revertedWith(
        "No shipment"
      );
      await expect(dd.rebirth(tokenId + 1)).to.be.revertedWith("No shipment");
      await dd.rebirth(tokenId); // success
    });

    it("Should be enabled when locked", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);

      expect(await dd.isLocked()).to.be.false;
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.lockDiamondDawn();
      expect(await dd.isLocked()).to.be.true;
      await dd.rebirth(tokenId); // success
    });

    it("Should be enabled when locked and dawn stage", async () => {
      const tokenId = 1;
      await dd.enter(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.ship(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);

      expect(await dd.isLocked()).to.be.false;
      await dd.lockDiamondDawn();
      expect(await dd.isLocked()).to.be.true;
      await dd.rebirth(tokenId); // success
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await dd.connect(userA).enter(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.connect(userA).cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.connect(userA).polish(tokenId);
      await completeAndSetStage(dd, STAGE.SHIP);
      await dd.connect(userA).ship(tokenId);

      expect(await dd.totalSupply()).to.equal(0);
      expect(await dd.balanceOf(userA.address)).to.equal(0);
      await expect(dd.connect(userA).rebirth(tokenId))
        .to.emit(dd, "Transfer")
        .withArgs(
          "0x0000000000000000000000000000000000000000",
          userA.address,
          1
        )
        .and.to.emit(ddMine, "Rebirth")
        .withArgs(tokenId);
      expect(await dd.balanceOf(userA.address)).to.equal(1);
      expect(await dd.ownerOf(tokenId)).to.be.equal(userA.address);
      expect(await dd.totalSupply()).to.equal(1);
    });
  });

  describe("tokenURI", () => {
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
      await diamondDawn.setStage(STAGE.INVITE);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signMessage(signer, admin);
      userASig = signMessage(signer, userA);
    });

    it("should delegate to Mine - sanity check", async () => {
      await dd.connect(userA).enter(userASig, { value: PRICE });
      const metadata = await dd.tokenURI(1);
      const parsed = await assertBase64AndGetParsed(metadata);
      expect(parsed).to.deep.equal({
        name: "Mine Entrance #1",
        description: "description",
        created_by: "dd",
        image: `${BASE_URI}enterMine.mp4`,
        attributes: [{ trait_type: "Type", value: "Mine Entrance" }],
      });
    });
  });

  describe("supportsInterface", () => {
    let dd;

    beforeEach(async () => {
      const { diamondDawn } = await loadFixture(deployDD);
      dd = diamondDawn;
    });

    it("Should support interfaces", async () => {
      expect(await dd.supportsInterface(`0x80ac58cd`)).to.be.true; // ERC721: NFT
      expect(await dd.supportsInterface(`0x5b5e139f`)).to.be.true; // ERC721Metadata: NFT name, symbol & tokenURI
      expect(await dd.supportsInterface(`0x780e9d63`)).to.be.true; // ERC721Enumerable: totalSupply etc.
      expect(await dd.supportsInterface(`0x2a55205a`)).to.be.true; // ERC2981: Royalties
    });
  });

  describe("Transactions", () => {
    it("E2E tests :)", async () => {
      // TODO : add tests until the END :)
    });
  });
});
