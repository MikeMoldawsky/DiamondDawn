const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PhysicalToDigital", () => {
  let PhysicalToDigital;
  let physicalToDigital;
  let deployer;

  before(async () => {
    provider = ethers.provider;
    deployer = await (await ethers.getSigner()).address;
    PhysicalToDigital = await ethers.getContractFactory("PhysicalToDigital");
  });

  beforeEach(async () => {
    physicalToDigital = await PhysicalToDigital.deploy();
    await physicalToDigital.deployed();
  });

  it("Should deploy the contract", async () => {
    expect(physicalToDigital).to.not.equal(null);
  })
});
