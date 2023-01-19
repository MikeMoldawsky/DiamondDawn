require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const {
  signMessage,
  signMessageWithNumber,
} = require("./utils/SignatureUtils");

const { deployDDV2, deployKeyPhase } = require("./utils/DeployDDV2Utils");
const { getParsedMetadata } = require("./utils/DDV2MetadataTestUtils");
const { parseEther } = require("ethers/lib/utils");

describe("DiamondDawn", () => {
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
    });
  });

  describe("Mint", () => {
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

    xit("Mint and honorary mint", async () => {
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

    it("evolves correctly from reveal", async () => {
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
      await dd.safeSetNextPhase(keyPhase.address, "key", 2, price, "reveal");
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

    xit("evolves correctly from honorary reveal", async () => {
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
