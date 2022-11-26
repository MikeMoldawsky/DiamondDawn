require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { STAGE, ALL_STAGES } = require("./utils/EnumConverterUtils");
const {
  setCutManifest,
  setPolishManifest,
  setRebornManifest,
  assertBase64AndGetParsed,
  BASE_URI,
  KEY_MANIFEST,
} = require("./utils/MineTestUtils");
const {
  deployDD,
  deployDDWithMineReady,
  deployDDWithCutReady,
  deployDDWithPolishReady,
  NUM_TOKENS,
  deployDDWithRebirthReady,
} = require("./utils/DeployDDUtils");
const { signForgeMessage, signDawnMessage } = require("./utils/SignatureUtils");
const _ = require("lodash");
const { ethers } = require("hardhat");
const { PRICE, PRICE_MARRIAGE } = require("./utils/Consts");
const { completeAndSetStage } = require("./utils/DDTestUtils");
const { DIAMOND_TO_COLOR, DIAMOND } = require("./utils/Diamonds");

describe("DiamondDawn", () => {
  describe("forge and forgeWithPartner", () => {
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
      await diamondDawn.setStage(STAGE.KEY);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      user = users.pop();
      signer1 = signer;
      adminSig = signForgeMessage(signer, admin);
      userSig = signForgeMessage(signer, user);
      users1 = users;
    });

    it("Should REVERT when price is wrong", async () => {
      await expect(
        dd.forge(adminSig, { value: PRICE.add(parseEther("0.0001")) })
      ).to.be.revertedWith(`Cost is: ${PRICE.toString()}`);
      await expect(
        dd.forge(adminSig, { value: PRICE.sub(parseEther("0.0001")) })
      ).to.be.revertedWith(`Cost is: ${PRICE.toString()}`);

      await expect(
        dd.forgeWithPartner(adminSig, {
          value: PRICE.add(parseEther("0.0001")),
        })
      ).to.be.revertedWith(`Cost is: ${PRICE_MARRIAGE.toString()}`);
      await expect(
        dd.forgeWithPartner(adminSig, {
          value: PRICE.sub(parseEther("0.0001")),
        })
      ).to.be.revertedWith(`Cost is: ${PRICE_MARRIAGE.toString()}`);
    });

    it("Should REVERT when not KEY stage", async () => {
      const notAllowedStages = _.without(ALL_STAGES, STAGE.KEY);
      for (const stage of notAllowedStages) {
        await completeAndSetStage(dd, stage);
        expect(await dd.stage()).to.equal(stage);
        await expect(dd.forge(adminSig, { value: PRICE })).to.be.revertedWith(
          "Wrong stage"
        );
        await expect(
          dd.forgeWithPartner(adminSig, { value: PRICE_MARRIAGE })
        ).to.be.revertedWith("Wrong stage");
      }
    });

    it("Should REVERT when stage is NOT active", async () => {
      await dd.completeStage(STAGE.KEY);
      expect(await dd.stage()).to.equal(STAGE.KEY);
      expect(await dd.isActive()).to.be.false;
      await expect(dd.forge(adminSig, { value: PRICE })).to.be.revertedWith(
        "Stage is inactive"
      );
      await expect(
        dd.forgeWithPartner(adminSig, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Stage is inactive");
    });

    it("Should REVERT when mine is full", async () => {
      await Promise.all(
        _.range(NUM_TOKENS).map(async (i) => {
          const signature = await signForgeMessage(signer1, users1[i]);
          return await dd.connect(users1[i]).forge(signature, { value: PRICE });
        })
      );
      await expect(dd.forge(adminSig, { value: PRICE })).to.be.revertedWith(
        "Max capacity"
      );
      await expect(
        dd.forgeWithPartner(adminSig, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Max capacity");
    });

    it("Should REVERT when mine is NOT READY", async () => {
      // transform mine to be not ready
      await ddMine.setManifest(STAGE.KEY, "");
      await expect(dd.forge(adminSig, { value: PRICE })).to.be.revertedWith(
        "Stage not ready"
      );

      await expect(
        dd.forgeWithPartner(adminSig, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Stage not ready");
    });

    // TODO: should enable before production
    xit("Should REVERT when trying to mine more than once", async () => {
      await dd.forge(adminSig, { value: PRICE });
      await expect(dd.forge(adminSig, { value: PRICE })).to.be.revertedWith(
        "Already minted"
      );
      await expect(
        dd.forgeWithPartner(adminSig, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Already minted");
      // test forgeWithPartner
      await dd
        .connect(user)
        .forgeWithPartner(userSig, { value: PRICE_MARRIAGE });
      await expect(
        dd.connect(user).forge(userSig, { value: PRICE })
      ).to.be.revertedWith("Already minted");
      await expect(
        dd.connect(user).forgeWithPartner(userSig, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Already minted");
    });

    it("Should REVERT when using wrong address signature", async () => {
      await expect(dd.forge(userSig, { value: PRICE })).to.be.revertedWith(
        "Not allowed to mint"
      );
      await expect(
        dd.forgeWithPartner(userSig, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Not allowed to mint");
    });

    it("Should REVERT when message is signed by another signer", async () => {
      const signedMessage = signForgeMessage(admin, admin);
      await expect(
        dd.forge(signedMessage, { value: PRICE })
      ).to.be.revertedWith("Not allowed to mint");
      await expect(
        dd.forgeWithPartner(signedMessage, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Not allowed to mint");
    });

    it("Should REVERT when using another address signed message", async () => {
      await expect(dd.forge(userSig, { value: PRICE })).to.be.revertedWith(
        "Not allowed to mint"
      );
      await expect(
        dd.forgeWithPartner(userSig, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Not allowed to mint");
    });

    it("Should REVERT when signed with a wrong message", async () => {
      const signature = signer1.signMessage("that's a wrong message");
      await expect(dd.forge(signature, { value: PRICE })).to.be.revertedWith(
        "Not allowed to mint"
      );
      await expect(
        dd.forgeWithPartner(signature, { value: PRICE_MARRIAGE })
      ).to.be.revertedWith("Not allowed to mint");
    });

    it("Should cost 4.44 and add it to contract's balance", async () => {
      expect(await ethers.provider.getBalance(dd.address)).to.equal(0);
      await dd.forge(adminSig, { value: PRICE });
      expect(await ethers.provider.getBalance(dd.address)).to.equal(PRICE);
      await dd
        .connect(user)
        .forgeWithPartner(userSig, { value: PRICE_MARRIAGE });
      expect(await ethers.provider.getBalance(dd.address)).to.equal(
        PRICE.add(PRICE_MARRIAGE)
      );
    });

    it("Should mint to owner, emit events & have the right token ID", async () => {
      await expect(dd.connect(user).forge(userSig, { value: PRICE }))
        .to.emit(dd, "Transfer")
        .withArgs("0x0000000000000000000000000000000000000000", user.address, 1)
        .to.emit(ddMine, "Forge")
        .withArgs(1);
      await expect(
        dd.connect(admin).forgeWithPartner(adminSig, { value: PRICE_MARRIAGE })
      )
        .to.emit(dd, "Transfer")
        .withArgs(
          "0x0000000000000000000000000000000000000000",
          admin.address,
          2
        )
        .to.emit(ddMine, "Forge")
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
      await diamondDawn.setStage(STAGE.KEY);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).forge(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.mine(tokenId)).to.be.revertedWith("Not owner");
      await expect(dd.connect(userB).mine(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await dd.connect(userA).mine(tokenId);
    });

    it("Should REVERT when not token owner after transfer", async () => {
      const tokenId = 1;
      await dd.connect(userA).forge(userASig, { value: PRICE });
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
      await dd.forge(adminSig, { value: PRICE });
      await expect(dd.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await setCutManifest(ddMine);
      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await setPolishManifest(ddMine);
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await setRebornManifest(ddMine);
      await completeAndSetStage(dd, STAGE.DAWN);
      await expect(dd.mine(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId); // success
    });

    it("Should REVERT when stage is NOT active", async () => {
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.completeStage(STAGE.MINE);
      expect(await dd.stage()).to.equal(STAGE.MINE);
      expect(await dd.isActive()).to.be.false;
      await expect(dd.mine(1)).to.be.revertedWith("Stage is inactive");
    });

    it("Should REVERT when mine is not ready", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      // transform mine to be not ready
      await ddMine.setManifest(STAGE.MINE, "");
      await expect(dd.mine(tokenId)).to.be.revertedWith(`Stage not ready`);
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.mine(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("Should REVERT when can NOT process token", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.mine(tokenId));
      await expect(dd.mine(tokenId)).to.be.revertedWith("Can't process");
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
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
      await diamondDawn.setStage(STAGE.KEY);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).forge(userASig, { value: PRICE });
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
      await dd.forge(adminSig, { value: PRICE });
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.mine(tokenId);

      await setPolishManifest(ddMine);
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await setRebornManifest(ddMine);
      await completeAndSetStage(dd, STAGE.DAWN);
      await expect(dd.cut(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId); // success
    });

    it("Should REVERT when stage is NOT active", async () => {
      await dd.forge(adminSig, { value: PRICE });
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
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.CUT);
      // transform mine to be not ready
      await ddMine.setManifest(STAGE.CUT, "");
      await expect(dd.cut(tokenId)).to.be.revertedWith("Stage not ready");
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.cut(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("Should REVERT when can NOT process token", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
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
      await dd.forge(adminSig, { value: PRICE });
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
      await diamondDawn.setStage(STAGE.KEY);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).forge(userASig, { value: PRICE });
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
      await dd.forge(adminSig, { value: PRICE });
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");

      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");
      await dd.cut(tokenId); // success

      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);

      await setRebornManifest(ddMine);
      await completeAndSetStage(dd, STAGE.DAWN);
      await expect(dd.polish(tokenId)).to.be.revertedWith("Wrong stage");
    });

    it("Should REVERT when stage is NOT active", async () => {
      await dd.forge(adminSig, { value: PRICE });
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
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.POLISH);
      // transform polish to be not ready
      await ddMine.setManifest(STAGE.POLISH, "");
      await expect(dd.polish(tokenId)).to.be.revertedWith("Stage not ready");
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.polish(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("Should REVERT when can NOT process token", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
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
      await dd.forge(adminSig, { value: PRICE });
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
    let signer_;
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
      signer_ = signer;
    });

    it("Should REVERT when not token owner", async () => {
      const tokenId = 1;
      await dd.connect(userA).forge(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.connect(userA).cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.connect(userA).polish(tokenId);

      await completeAndSetStage(dd, STAGE.DAWN);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Not owner");
      await expect(dd.connect(userB).ship(tokenId)).to.be.revertedWith(
        "Not owner"
      );
      await dd.connect(userA).ship(tokenId);
    });

    it("Should REVERT when wrong system stage", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
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

      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId); // success
      await expect(dd.ship(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("Should REVERT when stage is NOT active", async () => {
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(1);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(1);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(1);
      await completeAndSetStage(dd, STAGE.DAWN);

      await dd.completeStage(STAGE.DAWN);
      expect(await dd.stage()).to.equal(STAGE.DAWN);
      expect(await dd.isActive()).to.be.false;
      await expect(dd.ship(1)).to.be.revertedWith("Stage is inactive");
    });

    it("Should REVERT when ship is not ready", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.DAWN);
      // transform ship to be not ready
      await ddMine.setManifest(STAGE.DAWN, "");
      await expect(dd.ship(tokenId)).to.be.revertedWith("Stage not ready");
    });

    it("Should REVERT when token does not exist", async () => {
      const tokenId = 1;
      await completeAndSetStage(dd, STAGE.DAWN);
      await expect(dd.ship(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("Should REVERT when can NOT process token", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.DAWN);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Can't process");

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Can't process");

      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await expect(dd.ship(tokenId)).to.be.revertedWith("Can't process");

      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);
      await expect(dd.ship(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
      await dd.dawn(tokenId, await signDawnMessage(signer_, admin, tokenId));
      await expect(dd.ship(tokenId)).to.be.revertedWith("Can't process");
    });

    it("Should BURN and Delegate to mine", async () => {
      const tokenId = 1;
      await dd.connect(userA).forge(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.connect(userA).cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.connect(userA).polish(tokenId);

      await completeAndSetStage(dd, STAGE.DAWN);
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
        .withArgs(tokenId, 1, (number) => {
          number = Number(number);
          return (
            number === DIAMOND.number || number === DIAMOND_TO_COLOR.number
          );
        });
      expect(await dd.balanceOf(userA.address)).to.equal(0);
      await expect(dd.ownerOf(1)).to.be.revertedWith(
        "ERC721: invalid token ID"
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
    let userBSig;
    let signer_;

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
      userBSig = signForgeMessage(signer, userB);
      signer_ = signer;
    });

    it("Should REVERT when not DAWN stage", async () => {
      const tokenId = 1;
      const rebirthAdminSig = await signDawnMessage(signer_, admin, tokenId);
      await dd.forge(adminSig, { value: PRICE });

      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "Wrong stage"
      );
      await dd.mine(tokenId);

      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "Wrong stage"
      );
      await dd.cut(tokenId);

      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "Wrong stage"
      );
      await dd.polish(tokenId);

      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);

      await dd.dawn(tokenId, rebirthAdminSig); // success
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "No shipment"
      );
    });

    it("Should REVERT when not COMPLETED stage", async () => {
      const tokenId = 1;
      const rebirthAdminSig = await signDawnMessage(signer_, admin, tokenId);
      await dd.forge(adminSig, { value: PRICE });

      await completeAndSetStage(dd, STAGE.MINE);
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "Wrong stage"
      );
      await dd.mine(tokenId);

      await completeAndSetStage(dd, STAGE.CUT);
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "Wrong stage"
      );
      await dd.cut(tokenId);

      await completeAndSetStage(dd, STAGE.POLISH);
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "Wrong stage"
      );
      await dd.polish(tokenId);

      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);

      await completeAndSetStage(dd, STAGE.COMPLETED);
      await dd.dawn(tokenId, rebirthAdminSig); // success
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "No shipment"
      );
    });

    it("Should REVERT when not shipped", async () => {
      const tokenId = 1;
      const rebirthUserAdminSig = await signDawnMessage(
        signer_,
        userA,
        tokenId
      );
      await dd.connect(userA).forge(userASig, { value: PRICE });

      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);

      await completeAndSetStage(dd, STAGE.CUT);
      await dd.connect(userA).cut(tokenId);

      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.connect(userA).polish(tokenId);

      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.connect(userA).ship(tokenId);

      await expect(dd.dawn(tokenId, rebirthUserAdminSig)).to.be.revertedWith(
        "No shipment"
      );
      await expect(
        dd.connect(userB).dawn(tokenId, userBSig)
      ).to.be.revertedWith("No shipment");
      await dd.connect(userA).dawn(tokenId, rebirthUserAdminSig);
    });

    it("Should REVERT when ship stage not ready", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);

      // transform ship to be not ready
      const rebirthAdminSig = await signDawnMessage(signer_, admin, tokenId);
      await ddMine.setManifest(STAGE.DAWN, "");
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "Dawn not ready"
      );
    });

    it("Should REBIRTH when DAWN stage is not active", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);

      await dd.completeStage(STAGE.DAWN);
      expect(await dd.stage()).to.equal(STAGE.DAWN);
      expect(await dd.isActive()).to.be.false;
      await dd.dawn(tokenId, await signDawnMessage(signer_, admin, tokenId)); // success
    });

    it("Should REBIRTH when COMPLETED stage is not active", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);
      await completeAndSetStage(dd, STAGE.COMPLETED);
      await dd.completeStage(STAGE.COMPLETED);

      expect(await dd.stage()).to.equal(STAGE.COMPLETED);
      expect(await dd.isActive()).to.be.false;
      await dd.dawn(tokenId, await signDawnMessage(signer_, admin, tokenId)); // success
    });

    it("Should REVERT when using wrong signature", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);
      const signatureUserA = await signDawnMessage(signer_, userA, tokenId);
      await expect(dd.dawn(tokenId, signatureUserA)).to.be.revertedWith(
        "Not allowed to rebirth"
      );
      await expect(
        dd.connect(userA).dawn(tokenId, signatureUserA)
      ).to.be.revertedWith("No shipment");
      const signatureWrongToken = await signDawnMessage(
        signer_,
        admin,
        tokenId + 1
      );
      await expect(dd.dawn(tokenId, signatureWrongToken)).to.be.revertedWith(
        "Not allowed to rebirth"
      );
      const signatureWrongSigner = await signDawnMessage(admin, admin, tokenId);
      await expect(dd.dawn(tokenId, signatureWrongSigner)).to.be.revertedWith(
        "Not allowed to rebirth"
      );
      await expect(
        dd.dawn(tokenId, signer_.signMessage("that's a wrong message"))
      ).to.be.revertedWith("Not allowed to rebirth");
      await dd.dawn(tokenId, await signDawnMessage(signer_, admin, tokenId)); // success
    });

    it("Should REVERT when rebirth more than once", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);
      const rebirthAdminSig = await signDawnMessage(signer_, admin, tokenId);
      await dd.dawn(tokenId, rebirthAdminSig); // success
      await completeAndSetStage(dd, STAGE.COMPLETED);
      await expect(dd.dawn(tokenId, rebirthAdminSig)).to.be.revertedWith(
        "No shipment"
      );
    });

    it("Should REVERT when trying to rebirth another user token or with wrong tokenId", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);
      const rebirthUserASig = await signDawnMessage(signer_, admin, tokenId);
      const rebirthAdminSig = await signDawnMessage(signer_, admin, tokenId);
      await expect(
        dd.connect(userA).dawn(tokenId, rebirthUserASig)
      ).to.be.revertedWith("No shipment");
      await expect(dd.dawn(tokenId + 1, rebirthAdminSig)).to.be.revertedWith(
        "No shipment"
      );
      await dd.dawn(tokenId, rebirthAdminSig); // success
    });

    it("Should be enabled when locked", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);

      expect(await dd.isLocked()).to.be.false;
      await completeAndSetStage(dd, STAGE.COMPLETED);
      await dd.lockDiamondDawn();
      expect(await dd.isLocked()).to.be.true;
      await dd.dawn(tokenId, await signDawnMessage(signer_, admin, tokenId)); // success
    });

    it("Should be enabled when locked and dawn stage", async () => {
      const tokenId = 1;
      await dd.forge(adminSig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.ship(tokenId);
      await completeAndSetStage(dd, STAGE.COMPLETED);

      expect(await dd.isLocked()).to.be.false;
      await dd.lockDiamondDawn();
      expect(await dd.isLocked()).to.be.true;
      await dd.dawn(tokenId, await signDawnMessage(signer_, admin, tokenId)); // success
    });

    it("Should delegate to mine", async () => {
      const tokenId = 1;
      await dd.connect(userA).forge(userASig, { value: PRICE });
      await completeAndSetStage(dd, STAGE.MINE);
      await dd.connect(userA).mine(tokenId);
      await completeAndSetStage(dd, STAGE.CUT);
      await dd.connect(userA).cut(tokenId);
      await completeAndSetStage(dd, STAGE.POLISH);
      await dd.connect(userA).polish(tokenId);
      await completeAndSetStage(dd, STAGE.DAWN);
      await dd.connect(userA).ship(tokenId);

      expect(await dd.totalSupply()).to.equal(0);
      expect(await dd.balanceOf(userA.address)).to.equal(0);
      await expect(
        dd
          .connect(userA)
          .dawn(tokenId, await signDawnMessage(signer_, userA, tokenId))
      )
        .to.emit(dd, "Transfer")
        .withArgs(
          "0x0000000000000000000000000000000000000000",
          userA.address,
          1
        )
        .and.to.emit(ddMine, "Dawn")
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
      await diamondDawn.setStage(STAGE.KEY);
      dd = diamondDawn;
      ddMine = diamondDawnMine;
      admin = owner;
      userA = users[0];
      userB = users[1];
      adminSig = signForgeMessage(signer, admin);
      userASig = signForgeMessage(signer, userA);
    });

    it("should delegate to Mine - sanity check", async () => {
      await dd.connect(userA).forge(userASig, { value: PRICE });
      const metadata = await dd.tokenURI(1);
      const parsed = await assertBase64AndGetParsed(metadata);
      expect(parsed).to.deep.equal({
        name: "Mine Key #1",
        image: `${BASE_URI}${KEY_MANIFEST}/resource.jpeg`,
        animation_url: `${BASE_URI}${KEY_MANIFEST}/resource.mp4`,
        attributes: [
          { trait_type: "Origin", value: "Metaverse" },
          { trait_type: "Type", value: "Key" },
          { trait_type: "Metal", value: "Gold" },
        ],
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
