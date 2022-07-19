/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
chai = require("chai");
const Web3 = require("web3");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");

chai.use(require("chai-bignumber")());

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
const ROYALTY_FEE_IN_BIPS = "1000"; // 10% royalty fee
const addressZero = "0x0000000000000000000000000000000000000000";

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
  user8 = signers[8]; // second admin account

  const DiamondDawn = await ethers.getContractFactory("DiamondDawn");
  diamondDawnContract = await DiamondDawn.deploy(ROYALTY_FEE_IN_BIPS,[owner.address,user8.address]);

  await diamondDawnContract.deployed();
});

describe("When contract is deployed", async () => {
  describe("State", async () => {

      it("Should have a zero balance", async () => {
          // TODO: discover how to get contract balance
          // expect(await diamondDawnContract.getBalance()).to.be.bignumber.that.is.zero;
      });

      it("Should be paused", async () => {
          expect(await diamondDawnContract.paused()).to.equal(true);
      });

      it("Should not be with an active stage", async () => {
          expect(await diamondDawnContract.isStageActive()).to.equal(false);
      });

      it("Should not have stage set to mine", async () => {
          expect(await diamondDawnContract.stage()).to.equal(0);
      });

      it("Should have royalty fee set", async () => {
          // expect(diamondDawnContract.stage()).to.equal(0);
      });

      it("Should set the deployer as an admin", async () => {

          const isAdmin = await diamondDawnContract.hasRole(
              ADMIN_ROLE,
              owner.address
            );

          expect(isAdmin).to.equal(true);

          // checking user 8 that is also admin
          const isUser8Admin = await diamondDawnContract.hasRole(ADMIN_ROLE,user8.address);

          expect(isUser8Admin).to.equal(true);
      });

      it("Should have MINING_PRICE set to 0.002 eth", async () => {
          expect(await diamondDawnContract.MINING_PRICE()).equal(Web3.utils.toWei('0.002'));
      });

      it("Should have CUT_PRICE set to 0.004 eth", async () => {
          expect(await diamondDawnContract.CUT_PRICE()).equal(Web3.utils.toWei('0.004'));
      });

      it("Should have POLISH_PRICE set to 0.006 eth", async () => {
          expect(await diamondDawnContract.POLISH_PRICE()).equal(Web3.utils.toWei('0.006'));
      });

      it("Should have PREPAID_CUT_PRICE set to 0.002 eth", async () => {
          expect(await diamondDawnContract.PREPAID_CUT_PRICE()).equal(Web3.utils.toWei('0.002'))
      });

      it("Should have PREPAID_POLISH_PRICE set to 0.004 eth", async () => {
          expect(await diamondDawnContract.PREPAID_POLISH_PRICE()).equal(Web3.utils.toWei('0.004'));
      });
  });

  describe("Admin API", async () => {
    it("setRoyaltyInfo", async () => {
      // const a = await diamondDawnContract.connect(user1).unpause()
    });

    it("pause/unpause", async () => {
      let pauseState = await diamondDawnContract.paused();
      await expect(pauseState).to.equal(true);

      await expect(diamondDawnContract.connect(user1).unpause()).to.be.reverted;

      await expect(diamondDawnContract.connect(owner).unpause()).to.not.to.be
        .reverted;

      pauseState = await diamondDawnContract.paused();
      await expect(pauseState).to.equal(false);
    });

    it("setProcessingPrice", async () => {});

    it("revealStage", async () => {});

    it("completeCurrentStage", async () => {});

    it("addToAllowList", async () => {
      const allowlist = [user1.address, user2.address];

      // unpausing the contract
      await diamondDawnContract.connect(owner).unpause();

      // only admin can add users to allowlist
      await expect(diamondDawnContract.connect(user1).addToAllowList(allowlist))
        .to.be.reverted;
      await diamondDawnContract.connect(owner).addToAllowList(allowlist);

      // activating a stage for users to mine
      await diamondDawnContract.revealStage("");

      await diamondDawnContract
        .connect(user1)
        .mine(1, { value: parseEther("0.004") });

      const balanceOfUser1 = await diamondDawnContract.balanceOf(user1.address);
      expect(balanceOfUser1).to.equal(1);

      // user should get a revert from contract if he is minting again
      await expect(
        diamondDawnContract
          .connect(user1)
          .mine(1, { value: parseEther("0.004") })
      ).to.be.reverted;

      // user not in the whitelist cant mint nft
      await expect(
        diamondDawnContract
          .connect(user3)
          .mine(1, { value: parseEther("0.004") })
      ).to.be.reverted;
    });

    it("completeCurrentStage", async () => {
      const currentStage = await diamondDawnContract.stage();

      await expect(diamondDawnContract.connect(owner).completeCurrentStage()).to
        .not.to.be.reverted;

      expect(await diamondDawnContract.stage()).to.not.equal(currentStage);

      expect(await diamondDawnContract.stage()).to.equal(
        parseInt(currentStage) + 1
      );
    });
  });

  describe("Client API", async () => {
    beforeEach(async function () {
      const allowlist = [user1.address, user2.address];
      // unpausing the contract
      await diamondDawnContract.connect(owner).unpause();
      await diamondDawnContract.connect(owner).addToAllowList(allowlist);
      // activating a stage for users to mine
      await diamondDawnContract.revealStage("");
    });
    it("mine", async () => {

        await expect(diamondDawnContract
        .connect(user1)
        .mine(1, { value: parseEther("0.004") })).to.be.reverted;

      await diamondDawnContract
        .connect(user1)
        .mine(1, { value: parseEther("0.004") });

      const balanceOfUser1 = await diamondDawnContract.balanceOf(user1.address);
      expect(balanceOfUser1).to.equal(1);
    });

    it("cut", async () => {
      // token id 0 is minted
      await diamondDawnContract
        .connect(user1)
        .mine(1, { value: parseEther("0.004") });

      // current stage is mine but running cut
      await expect(
        diamondDawnContract
          .connect(user1)
          .cut(0, { value: parseEther("0.004") })
      ).to.be.reverted;
      await expect(
        diamondDawnContract
          .connect(user1)
          .cut(0, { value: parseEther("0.003") })
      ).to.be.reverted;

      await expect(
        diamondDawnContract.connect(user1).cut({ value: parseEther("0.004") })
      ).to.be.reverted;

      await diamondDawnContract.connect(owner).completeCurrentStage();
      await diamondDawnContract.connect(owner).revealStage("");

      const isStageActive = await diamondDawnContract.isStageActive();

      expect(isStageActive).to.equal(true);

      await diamondDawnContract
        .connect(user1)
        .cut(0, { value: parseEther("0.004") });
    });

    it("polish", async () => {
      // token id 0 is minted
      await diamondDawnContract
        .connect(user1)
        .mine(1, { value: parseEther("0.004") });

      await diamondDawnContract
        .connect(user2)
        .mine(1, { value: parseEther("0.004") });

      // current stage is mine but running cut
      await expect(
        diamondDawnContract
          .connect(user1)
          .cut(0, { value: parseEther("0.004") })
      ).to.be.reverted;
      await expect(
        diamondDawnContract
          .connect(user1)
          .cut(0, { value: parseEther("0.003") })
      ).to.be.reverted;

      await expect(
        diamondDawnContract.connect(user1).cut({ value: parseEther("0.004") })
      ).to.be.reverted;

      await diamondDawnContract.connect(owner).completeCurrentStage();
      await diamondDawnContract.connect(owner).revealStage("");

      const isStageActive = await diamondDawnContract.isStageActive();

      expect(isStageActive).to.equal(true);

      await diamondDawnContract
        .connect(user1)
        .cut(0, { value: parseEther("0.004") });

      await diamondDawnContract.connect(owner).completeCurrentStage();
      await diamondDawnContract.connect(owner).revealStage("");

      await expect(
        diamondDawnContract
          .connect(user2)
          .cut(0, { value: parseEther("0.004") })
      ).to.be.reverted;

      await diamondDawnContract
        .connect(user1)
        .polish(0, { value: parseEther("0.006") });

      // user 2 has not performed cut so he cant perform polish
      await expect(
        diamondDawnContract
          .connect(user2)
          .polish(1, { value: parseEther("0.006") })
      ).to.be.reverted;
    });

    it("burn", async () => {
      // token id 0 is minted
      await diamondDawnContract
        .connect(user1)
        .mine(1, { value: parseEther("0.004") });

      await diamondDawnContract
        .connect(user2)
        .mine(1, { value: parseEther("0.004") });

      // current stage is mine but running cut
      await expect(
        diamondDawnContract
          .connect(user1)
          .cut(0, { value: parseEther("0.004") })
      ).to.be.reverted;
      await expect(
        diamondDawnContract
          .connect(user1)
          .cut(0, { value: parseEther("0.003") })
      ).to.be.reverted;

      await expect(
        diamondDawnContract.connect(user1).cut({ value: parseEther("0.004") })
      ).to.be.reverted;

      await diamondDawnContract.connect(owner).completeCurrentStage();
      await diamondDawnContract.connect(owner).revealStage("");

      const isStageActive = await diamondDawnContract.isStageActive();

      expect(isStageActive).to.equal(true);

      await diamondDawnContract
        .connect(user1)
        .cut(0, { value: parseEther("0.004") });

      await diamondDawnContract.connect(owner).completeCurrentStage();
      await diamondDawnContract.connect(owner).revealStage("");

      await diamondDawnContract
        .connect(user1)
        .polish(0, { value: parseEther("0.006") });

      await diamondDawnContract.connect(owner).completeCurrentStage();
      await diamondDawnContract.connect(owner).revealStage("");

      await diamondDawnContract.connect(user1).burn(0);
    });

    it("rebirth", async () => {
      // token id 0 is minted
      await diamondDawnContract
        .connect(user1)
        .mine(1, { value: parseEther("0.004") });

      await diamondDawnContract
        .connect(user2)
        .mine(1, { value: parseEther("0.004") });

      // current stage is mine but running cut
      await expect(
        diamondDawnContract
          .connect(user1)
          .cut(0, { value: parseEther("0.004") })
      ).to.be.reverted;
      await expect(
        diamondDawnContract
          .connect(user1)
          .cut(0, { value: parseEther("0.003") })
      ).to.be.reverted;

      await expect(
        diamondDawnContract.connect(user1).cut({ value: parseEther("0.004") })
      ).to.be.reverted;

      await diamondDawnContract.connect(owner).completeCurrentStage();
      await diamondDawnContract.connect(owner).revealStage("");

      const isStageActive = await diamondDawnContract.isStageActive();

      expect(isStageActive).to.equal(true);

      await diamondDawnContract
        .connect(user1)
        .cut(0, { value: parseEther("0.004") });

      await diamondDawnContract.connect(owner).completeCurrentStage();
      await diamondDawnContract.connect(owner).revealStage("");

      await diamondDawnContract
        .connect(user1)
        .polish(0, { value: parseEther("0.006") });

      await expect(diamondDawnContract.connect(user1).rebirth(0)).to.be
        .reverted;

      await diamondDawnContract.connect(owner).completeCurrentStage();
      await diamondDawnContract.connect(owner).revealStage("");

      await diamondDawnContract.connect(user1).burn(0);

      let balanceOfUser1 = await diamondDawnContract.balanceOf(user1.address);

      expect(balanceOfUser1).to.equal(0);

      await diamondDawnContract.connect(user1).rebirth(0);

      balanceOfUser1 = await diamondDawnContract.balanceOf(user1.address);

      expect(balanceOfUser1).to.equal(1);

      ownerOfTokenId0 = await diamondDawnContract.ownerOf(0);

      expect(ownerOfTokenId0).to.equal(user1.address);
    });

    it("tokenURI", async () => {});

    describe("When stage is not active", async() => {

        it("mine", async() => {

        });

        it("cut", async() => {

        });

        it("polish", async() => {

        });

        it("burn", async() => {

        });

        it("rebirth", async() => {

        });

        it("tokenURI", async() => {

        });

        it("addToAllowList", async() => {

        });
    });

    describe("When stage is active", async() => {

        it("mine", async() => {

        });

        it("cut", async() => {

        });

        it("polish", async() => {

        });

        it("burn", async() => {

        });

        it("rebirth", async() => {

        });

        it("tokenURI", async() => {

        });

        it("addToAllowList", async() => {

        });
    });
  });
});
