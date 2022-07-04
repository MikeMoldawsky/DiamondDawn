const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DiamondDawn", () => {
  let DiamondDawn;
  let diamondDawn;
  let deployer;

  before(async () => {
    provider = ethers.provider;
    deployer = await (await ethers.getSigner()).address;
    DiamondDawn = await ethers.getContractFactory("DiamondDawn");
  });

  beforeEach(async () => {
    diamondDawn = await DiamondDawn.deploy();
    await diamondDawn.deployed();
  });

  it("Should deploy the contract", async () => {
    expect(diamondDawn).to.not.equal(null);
  });
});
