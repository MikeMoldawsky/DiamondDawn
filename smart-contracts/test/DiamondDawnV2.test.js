require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { STAGE, ALL_STAGES } = require("./utils/EnumConverterUtils");
const { signForgeMessage, signDawnMessage } = require("./utils/SignatureUtils");
const _ = require("lodash");
const { ethers } = require("hardhat");

const {deployDDV2} = require("./utils/DeployDDV2Utils");

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
      const { diamondDawnV2, owner, signer, users } = await loadFixture(deployDDV2);
      dd = diamondDawnV2;
      admin = owner;
      user = users.pop();
      signer1 = signer;
      adminSig = signForgeMessage(signer, admin);
      userSig = signForgeMessage(signer, user);
      users1 = users;
    });

    it("Should REVERT when price is wrong", async () => {
      expect(await dd.MAX_ENTRANCE()).to.equal(5555);
    });
  });
});
