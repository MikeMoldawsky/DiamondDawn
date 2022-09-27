const { ethers } = require("hardhat");
const { setAllVideoUrls } = require("./MineTestUtils");

// constants
const MAX_TOKENS = 10;

async function deployMine() {
  const [owner, user1, user2, signer] = await ethers.getSigners();
  const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine");
  const diamondDawnMine = await DiamondDawnMine.deploy();
  await diamondDawnMine.deployed();
  return {
    diamondDawnMine,
    owner,
    user1,
    user2,
    signer,
  };
}

async function deployInitializedMine() {
  const { diamondDawnMine, owner, user1, user2 } = await deployMine();
  const diamondDawn = user2;
  await diamondDawnMine.connect(diamondDawn).initialize(MAX_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
  };
}

async function deployReadyMine() {
  const { diamondDawnMine, diamondDawn, owner, user1 } =
    await deployInitializedMine();
  await setAllVideoUrls(diamondDawnMine);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
  };
}

module.exports = {
  deployMine,
  deployInitializedMine,
  deployReadyMine,
  MAX_TOKENS,
};
