const { ethers } = require("hardhat");
const { setAllVideoUrls } = require("./MineTestUtils");

// constants
const MAX_TOKENS = 10;

async function deployMine() {
  const [owner, user1, user2] = await ethers.getSigners();
  const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine");
  const diamondDawnMine = await DiamondDawnMine.deploy();
  await diamondDawnMine.deployed();
  return {
    diamondDawnMine,
    owner,
    user1,
    user2,
  };
}

async function deployInitializedMine() {
  const { diamondDawnMine, owner, user1, user2 } = await deployMine();
  const diamondDawn = user2;
  await diamondDawnMine.connect(diamondDawn).initialize(333);
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

async function deployDD() {
  const { diamondDawnMine, owner, user1, user2 } = await deployMine();
  const DiamondDawn = await ethers.getContractFactory("DiamondDawn");
  const diamondDawn = await DiamondDawn.deploy(
    diamondDawnMine.address,
    MAX_TOKENS
  );
  await diamondDawn.deployed();
  return { diamondDawn, diamondDawnMine, owner, user1, user2 };
}

module.exports = {
  deployMine,
  deployInitializedMine,
  deployReadyMine,
  deployDD,
};
