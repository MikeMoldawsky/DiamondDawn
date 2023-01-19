require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { STAGE, ALL_STAGES } = require("./utils/EnumConverterUtils");
const {
  signMessage,
  signMessageWithNumber,
} = require("./utils/SignatureUtils");
const _ = require("lodash");
const { ethers } = require("hardhat");

const { deployDDV2 } = require("./utils/DeployDDV2Utils");
const { PRICE } = require("./utils/Consts");
const { getParsedMetadata } = require("./utils/DDV2MetadataTestUtils");

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

    it("Should REVERT when price is wrong", async () => {
      expect(await dd.MAX_ENTRANCE()).to.equal(5555);

      await dd.safeOpenCurrentPhase();
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
