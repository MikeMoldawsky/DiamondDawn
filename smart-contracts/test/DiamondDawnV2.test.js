require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const {
  signMessage,
  signMessageWithNumber,
} = require("./utils/SignatureUtils");

const {
  deployDDV2,
  deployKeyPhase,
  deployDDV2WithPhase,
} = require("./utils/DeployDDV2Utils");
const {
  getParsedMetadata,
  assertMintMetadata,
} = require("./utils/DDV2MetadataTestUtils");
const { parseEther } = require("ethers/lib/utils");
const { PRICE_MINT, MAX_TOKENS } = require("./utils/ConstsV2");
const _ = require("lodash");

describe("DiamondDawnV2", () => {
  describe("Deployed", () => {
    let dd;
    let admin;
    let user;
    let signer1;
    let adminSig;
    let userSig;
    let users1;

    beforeEach(async () => {
      const { diamondDawnV2, owner, signer, users } = await loadFixture(
        deployDDV2
      );
      dd = diamondDawnV2;
      admin = owner;
      user = users.pop();
      signer1 = signer;
      adminSig = signMessage(signer, admin);
      userSig = signMessage(signer, user);
      users1 = users;
    });

    xit("Deployed correctly", async () => {
      expect(await dd.MAX_TOKENS()).to.equal(5555);
      // TODO: add tests
    });
  });

  describe("mint", () => {
    let dd;
    let admin;
    let user;
    let signer1;
    let adminSig;
    let userSig;
    let users1;

    beforeEach(async () => {
      const { diamondDawnV2, owner, signer, users } = await loadFixture(
        deployDDV2
      );
      dd = diamondDawnV2;
      admin = owner;
      user = users.pop();
      signer1 = signer;
      adminSig = signMessage(signer, admin);
      userSig = signMessage(signer, user);
      users1 = users;
    });

    it("Should REVERT when phase is NOT active", async () => {
      await dd.setActive(false);
      expect(await dd.isActive()).to.be.false;
      await expect(
        dd.mint(signMessageWithNumber(signer1, admin, 1), 1, {
          value: PRICE_MINT.add(parseEther("0.0001")),
        })
      ).to.be.revertedWith("Phase is inactive");
    });

    it("Should REVERT when price is wrong", async () => {
      expect(await dd.isActive()).to.be.false;
      await dd.setActive(true);
      await expect(
        dd.mint(signMessageWithNumber(signer1, admin, 1), 1, {
          value: PRICE_MINT.add(parseEther("0.0001")),
        })
      ).to.be.revertedWith(`Cost is: ${PRICE_MINT.toString()}`);

      // Test for quantity 2
      await expect(
        dd.mint(signMessageWithNumber(signer1, admin, 2), 2, {
          value: PRICE_MINT.add(parseEther("0.0001")),
        })
      ).to.be.revertedWith(`Cost is: ${(PRICE_MINT * 2).toString()}`);
    });

    it("Should REVERT when phase is closed", async () => {
      await dd.setActive(true);
      await dd.safeOpenPhase();
      await dd.closePhase("mint");

      const signature = signMessageWithNumber(signer1, admin, 1);
      await expect(
        dd.mint(signature, 1, {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Phase is closed");
      await dd.openPhase("mint");
      await dd.mint(signature, 1, { value: PRICE_MINT });
      expect(await dd.ownerOf(1)).to.be.equal(admin.address);
    });

    it("Should REVERT when wrong signature", async () => {
      await dd.safeOpenPhase();
      const wrongQuantitySignature = signMessageWithNumber(signer1, admin, 2);
      await expect(
        dd.mint(wrongQuantitySignature, 1, {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Not allowed to mint");
      const wrongUserSignature = signMessageWithNumber(signer1, admin, 1);
      await expect(
        dd.connect(user).mint(wrongUserSignature, 1, {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Not allowed to mint");
      // works
      await dd.connect(user).mint(signMessageWithNumber(signer1, user, 1), 1, {
        value: PRICE_MINT,
      });
    });

    it("Should REVERT when more than max mint", async () => {
      await dd.safeOpenPhase();
      const maxMint = await dd.MAX_MINT();

      await expect(
        dd.mint(
          signMessageWithNumber(signer1, admin, maxMint + 1),
          maxMint + 1,
          { value: PRICE_MINT }
        )
      ).to.be.revertedWith("Exceeds max quantity");
      // works
      await dd.mint(signMessageWithNumber(signer1, admin, maxMint), maxMint, {
        value: PRICE_MINT,
      });
    });

    it("Should REVERT when trying to mine more than once", async () => {
      await dd.safeOpenPhase();
      await dd.mint(signMessageWithNumber(signer1, admin, 1), 1, {
        value: PRICE_MINT,
      });
      await expect(
        dd.mint(signMessageWithNumber(signer1, admin, 1), 1, {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Already minted");
    });

    it("Should REVERT when new phase started", async () => {
      const { keyPhase } = await deployKeyPhase();

      await expect(
        dd.mint(signMessageWithNumber(signer1, admin, 1), 1, {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Phase is inactive");

      await dd.safeClosePhase();
      await dd.safeSetNextPhase(keyPhase.address, 2, parseEther("4.99"));
      await dd.safeOpenPhase();
      await expect(
        dd.mint(signMessageWithNumber(signer1, admin, 1), 1, {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Phase is closed");
      // works
      await dd.openPhase("mint");
      await dd.mint(signMessageWithNumber(signer1, admin, 1), 1, {
        value: PRICE_MINT,
      });
    });

    it("Should REVERT when mint stage isn't supported", async () => {
      const { keyPhase } = await deployKeyPhase();
      await expect(deployDDV2WithPhase(keyPhase)).to.be.reverted;
    });

    xit("Should REVERT when mine minted out", async () => {
      await dd.safeOpenPhase();
      await expect(
        dd.mint(signMessageWithNumber(signer1, admin, 5556), 5556, {
          value: PRICE_MINT * 5556,
        })
      ).to.be.revertedWith("Max capacity");

      const tokens = 5500;

      await Promise.all(
        _.range(250).map(async (i) => {
          const signature = await signMessageWithNumber(signer1, users1[i], 10);
          console.log(">>>>>>>>>>>>>>>>>>", i);
          const newVar = await dd
            .connect(users1[i])
            .mint(signature, 10, { value: PRICE_MINT });
          console.log("<<<<<<<<<<<<<<<<<<", i);
          return newVar;
        })
      );

      await Promise.all(
        _.range(250, 500).map(async (i) => {
          const signature = await signMessageWithNumber(signer1, users1[i], 10);
          console.log("2>>>>>>>>>>>>>>>>>>", i);
          const newVar = await dd
            .connect(users1[i])
            .mint(signature, 10, { value: PRICE_MINT });
          console.log("2<<<<<<<<<<<<<<<<<<", i);
          return newVar;
        })
      );
      const tokenLeft = MAX_TOKENS - tokens;
      const n2 = await dd.MAX_TOKENS();
      const n1 = await dd.totalSupply();
      console.log("Left tokens", { n1, n2, tokenLeft, left: n2 - n1 });

      // await expect(
      //   dd.forge(adminSig, 2, { value: PRICE.add(PRICE) })
      // ).to.be.revertedWith("Max capacity");
      // await dd.forge(adminSig, 1, { value: PRICE }); // success mining 1 left
      // await expect(dd.forge(adminSig, 1, { value: PRICE })).to.be.revertedWith(
      //   "Max capacity"
      // );
      // await expect(
      //   dd.forgeWithPartner(adminSig, 1, { value: PRICE_MARRIAGE })
      // ).to.be.revertedWith("Max capacity");
    });

    it("Should mint to owner, emit events & have the right token ID", async () => {
      await dd.safeOpenPhase();

      const expectedResult = await expect(
        dd
          .connect(user)
          .mint(signMessageWithNumber(signer1, user, 5), 5, { value: 0 })
      );
      await Promise.all(
        _.range(1, 6).map(async (tokenId) => {
          await expectedResult.to
            .emit(dd, "Transfer")
            .withArgs(
              "0x0000000000000000000000000000000000000000",
              user.address,
              tokenId
            );
          expect(await dd.ownerOf(tokenId)).to.be.equal(user.address);
          await assertMintMetadata(user, dd, tokenId);
        })
      );
    });
  });

  describe("mintHonorary", () => {
    let dd;
    let admin;
    let user;
    let signer1;
    let adminSig;
    let userSig;
    let users1;

    beforeEach(async () => {
      const { diamondDawnV2, owner, signer, users } = await loadFixture(
        deployDDV2
      );
      dd = diamondDawnV2;
      admin = owner;
      user = users.pop();
      signer1 = signer;
      adminSig = signMessage(signer, admin);
      userSig = signMessage(signer, user);
      users1 = users;
    });

    it("Should REVERT when phase is NOT active", async () => {
      await dd.setActive(false);
      expect(await dd.isActive()).to.be.false;
      await expect(
        dd.mintHonorary(signMessage(signer1, admin), {
          value: PRICE_MINT.add(parseEther("0.0001")),
        })
      ).to.be.revertedWith("Phase is inactive");
    });

    it("Should REVERT when price is wrong", async () => {
      expect(await dd.isActive()).to.be.false;
      await dd.setActive(true);
      await expect(
        dd.mintHonorary(signMessage(signer1, admin), {
          value: PRICE_MINT.add(parseEther("0.0001")),
        })
      ).to.be.revertedWith(`Cost is: ${PRICE_MINT.toString()}`);

      // Test for quantity 2
      await expect(
        dd.mintHonorary(signMessage(signer1, admin), {
          value: PRICE_MINT.add(parseEther("0.0001")),
        })
      ).to.be.revertedWith(`Cost is: ${(PRICE_MINT * 2).toString()}`);
    });

    it("Should REVERT when phase is closed", async () => {
      await dd.setActive(true);
      await dd.safeOpenPhase();
      await dd.closePhase("mint");

      const signature = signMessage(signer1, admin);
      await expect(
        dd.mintHonorary(signature, {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Phase is closed");
      await dd.openPhase("mint");
      await dd.mintHonorary(signature, { value: PRICE_MINT });
      expect(await dd.ownerOf(1)).to.be.equal(admin.address);
    });

    it("Should REVERT when wrong signature", async () => {
      await dd.safeOpenPhase();
      const wrongQuantitySignature = signMessageWithNumber(signer1, admin, 1);
      await expect(
        dd.mintHonorary(wrongQuantitySignature, {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Not allowed to mint");
      const wrongUserSignature = signMessage(signer1, admin);
      await expect(
        dd.connect(user).mintHonorary(wrongUserSignature, {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Not allowed to mint");
      // works
      await dd.connect(user).mintHonorary(signMessage(signer1, user), {
        value: PRICE_MINT,
      });
    });

    it("Should REVERT when trying to mine more than once", async () => {
      await dd.safeOpenPhase();
      await dd.mintHonorary(signMessage(signer1, admin), {
        value: PRICE_MINT,
      });
      await expect(
        dd.mintHonorary(signMessage(signer1, admin), {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Already minted");
    });

    it("Should REVERT when new phase started", async () => {
      const { keyPhase } = await deployKeyPhase();

      await expect(
        dd.mintHonorary(signMessage(signer1, admin), {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Phase is inactive");

      await dd.safeClosePhase();
      await dd.safeSetNextPhase(keyPhase.address, 2, parseEther("4.99"));
      await dd.safeOpenPhase();
      await expect(
        dd.mintHonorary(signMessage(signer1, admin), {
          value: PRICE_MINT,
        })
      ).to.be.revertedWith("Phase is closed");
      // works
      await dd.openPhase("mint");
      await dd.mintHonorary(signMessage(signer1, admin), {
        value: PRICE_MINT,
      });
    });

    it("Should REVERT when mint stage isn't supported", async () => {
      const { keyPhase } = await deployKeyPhase();
      await expect(deployDDV2WithPhase(keyPhase)).to.be.reverted;
    });

    xit("Should REVERT when mine minted out", async () => {
      // TODO; implement this test
    });

    it("Should mint to owner, emit events & have the right token ID", async () => {
      await dd.safeOpenPhase();

      const expectedResult = await expect(
        dd.connect(user).mintHonorary(signMessage(signer1, user), { value: 0 })
      );

      await expectedResult.to
        .emit(dd, "Transfer")
        .withArgs(
          "0x0000000000000000000000000000000000000000",
          user.address,
          1
        );
      expect(await dd.ownerOf(1)).to.be.equal(user.address);
      await assertMintMetadata(user, dd, 1, true);
    });
  });

  describe("Key Phase", () => {
    let dd;
    let admin;
    let user;
    let signer1;
    let adminSig;
    let userSig;
    let users1;

    beforeEach(async () => {
      const { diamondDawnV2, owner, signer, users } = await loadFixture(
        deployDDV2
      );
      dd = diamondDawnV2;
      admin = owner;
      user = users.pop();
      signer1 = signer;
      adminSig = signMessage(signer, admin);
      userSig = signMessage(signer, user);
      users1 = users;
    });

    xit("evolves correctly from mint", async () => {
      await dd.safeOpenPhase();

      await dd
        .connect(user)
        .mint(signMessageWithNumber(signer1, user, 5), 5, { value: 0 });

      await dd.connect(user).mintHonorary(userSig, { value: 0 });
      console.log("Metadata normal", {
        metadata: await getParsedMetadata(user, dd, 2),
      });
      console.log("Metadata normal", {
        metadata: await getParsedMetadata(user, dd, 6),
      });

      const { keyPhase } = await deployKeyPhase();

      const price = parseEther("4.99");

      await dd.safeClosePhase();
      await dd.safeSetNextPhase(keyPhase.address, 2, price);
      await dd.safeOpenPhase();

      await dd.connect(user).safeEvolveCurrentPhase(1, { value: price });
      // await dd.connect(user).safeEvolveCurrentPhase(2, { value: price });

      console.log("Metadata KEY evolved normal", {
        metadata: JSON.stringify(await getParsedMetadata(user, dd, 2)),
      });

      console.log("Metadata KEY evolved honorary", {
        metadata: JSON.stringify(await getParsedMetadata(user, dd, 1)),
      });
      await dd.connect(user).safeEvolveCurrentPhase(6, { value: price });
      console.log("Metadata KEY evolved honorary", {
        metadata: JSON.stringify(await getParsedMetadata(user, dd, 6)),
      });
    });

    xit("evolves correctly from honorary mint", async () => {
      await dd.safeOpenPhase();
      await expect(dd.connect(user).mintHonorary(userSig, { value: 0 }))
        .to.emit(dd, "Transfer")
        .withArgs(
          "0x0000000000000000000000000000000000000000",
          user.address,
          1
        );
      expect(await dd.ownerOf(1)).to.be.equal(user.address);
      // expect(await dd.ownerOf(2)).to.be.equal(admin.address);
      expect(await dd.balanceOf(user.address)).to.equal(1);
      // expect(await dd.balanceOf(admin.address)).to.equal(1);

      const parsedMetadata = await getParsedMetadata(user, dd, 1);
      console.log(parsedMetadata);
      await expect(
        dd
          .connect(user)
          .mint(signMessageWithNumber(signer1, user, 5), 5, { value: 0 })
      )
        .to.emit(dd, "Transfer")
        .withArgs("0x0000000000000000000000000000000000000000", user.address, 2)
        .to.emit(dd, "Transfer")
        .withArgs("0x0000000000000000000000000000000000000000", user.address, 3)
        .to.emit(dd, "Transfer")
        .withArgs("0x0000000000000000000000000000000000000000", user.address, 4)
        .to.emit(dd, "Transfer")
        .withArgs("0x0000000000000000000000000000000000000000", user.address, 5)
        .to.emit(dd, "Transfer")
        .withArgs(
          "0x0000000000000000000000000000000000000000",
          user.address,
          6
        );
      const parsedMetadata1 = await getParsedMetadata(user, dd, 2);
      console.log(parsedMetadata1);
    });
  });
});
