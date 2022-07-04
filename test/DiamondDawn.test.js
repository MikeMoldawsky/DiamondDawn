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

    console.log("flava nft package deployed at " + diamondDawnContract.address);
  });

  it("Should be matching some configerations", async () => {
    expect(await diamondDawnContract.name()).to.equals("DiamondDawn");
    expect(await diamondDawnContract.symbol()).to.equals("DD");
  });
});
