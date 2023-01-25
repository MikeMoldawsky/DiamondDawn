const { ethers } = require("hardhat");
const {
  prepareMineReady,
  prepareCutReady,
  preparePolishReady,
  prepareRebirthReady,
} = require("./MineTestUtils");
const { deployMineWithVideos } = require("./DeployMineUtils");

// constants
const NUM_TOKENS = 333;

async function deployDD() {
  const { diamondDawnMine, owner, users } = await deployMineWithVideos();
  const signer = users.pop();
  const DiamondDawn = await ethers.getContractFactory("DiamondDawnV1");
  const diamondDawn = await DiamondDawn.deploy(
    diamondDawnMine.address,
    signer.address
  );
  await diamondDawn.deployed();
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    signer,
    users,
  };
}

async function deployDDWithMineReady() {
  const { diamondDawn, diamondDawnMine, owner, signer, users } =
    await deployDD();
  await prepareMineReady(diamondDawnMine, NUM_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    signer,
    users,
  };
}

async function deployDDWithCutReady() {
  const { diamondDawn, diamondDawnMine, owner, signer, users } =
    await deployDD();
  await prepareCutReady(diamondDawnMine, NUM_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    signer,
    users,
  };
}

async function deployDDWithPolishReady() {
  const { diamondDawn, diamondDawnMine, owner, signer, users } =
    await deployDD();
  await preparePolishReady(diamondDawnMine, NUM_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    signer,
    users,
  };
}

async function deployDDWithRebirthReady() {
  const { diamondDawn, diamondDawnMine, owner, signer, users } =
    await deployDD();
  await prepareRebirthReady(diamondDawnMine, NUM_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    signer,
    users,
  };
}

module.exports = {
  deployDD,
  deployDDWithMineReady,
  deployDDWithCutReady,
  deployDDWithPolishReady,
  deployDDWithRebirthReady,
  NUM_TOKENS,
};
