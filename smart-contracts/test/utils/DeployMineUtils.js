const { ethers } = require("hardhat");
const { setAllVideoUrls } = require("./MineTestUtils");

// constants
const MAX_TOKENS = 10;

async function deployMine() {
  const users = await ethers.getSigners();
  const owner = users.shift();
  const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine");
  const diamondDawnMine = await DiamondDawnMine.deploy();
  await diamondDawnMine.deployed();
  return {
    owner,
    users,
    diamondDawnMine,
  };
}

async function deployInitializedMine() {
  const { diamondDawnMine, owner, users } = await deployMine();
  const diamondDawn = users.pop();
  await diamondDawnMine.connect(diamondDawn).initialize(MAX_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    users,
  };
}

async function deployReadyMine() {
  const { diamondDawnMine, diamondDawn, owner, users } =
    await deployInitializedMine();
  await setAllVideoUrls(diamondDawnMine);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    users,
  };
}

module.exports = {
  deployMine,
  deployInitializedMine,
  deployReadyMine,
  MAX_TOKENS,
};
