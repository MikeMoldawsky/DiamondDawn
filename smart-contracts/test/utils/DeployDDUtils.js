const { ethers } = require("hardhat");
const {
  prepareMineReady,
  prepareCutReady,
  preparePolishReady,
  prepareRebirthReady,
} = require("./MineTestUtils");
const { deployMine } = require("./DeployMineUtils");

// constants
const MAX_TOKENS = 10;

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

async function deployDDWithMineReady() {
  const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
    await deployDD();
  await prepareMineReady(diamondDawnMine, MAX_TOKENS);
  return { diamondDawn, diamondDawnMine, owner, user1, user2 };
}

async function deployDDWithCutReady() {
  const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
    await deployDD();
  await prepareCutReady(diamondDawnMine, MAX_TOKENS);
  return { diamondDawn, diamondDawnMine, owner, user1, user2 };
}

async function deployDDWithPolishReady() {
  const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
    await deployDD();
  await preparePolishReady(diamondDawnMine, MAX_TOKENS);
  return { diamondDawn, diamondDawnMine, owner, user1, user2 };
}

async function deployDDWithRebirthReady() {
  const { diamondDawn, diamondDawnMine, owner, user1, user2 } =
    await deployDD();
  await prepareRebirthReady(diamondDawnMine, MAX_TOKENS);
  return { diamondDawn, diamondDawnMine, owner, user1, user2 };
}

module.exports = {
  deployDD,
  deployDDWithMineReady,
  deployDDWithCutReady,
  deployDDWithPolishReady,
  deployDDWithRebirthReady,
  MAX_TOKENS,
};
