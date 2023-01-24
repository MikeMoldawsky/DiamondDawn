const { ethers } = require("hardhat");
const { setAllManifests } = require("./MineTestUtils");

async function deployMine() {
  const users = await ethers.getSigners();
  const owner = users.shift();
  const SerializerLib = await ethers.getContractFactory("DiamondSerializer");
  const serializer = await SerializerLib.deploy();
  const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine", {
    libraries: {
      DiamondSerializer: serializer.address,
    },
  });
  const diamondDawnMine = await DiamondDawnMine.deploy();
  await diamondDawnMine.deployed();
  return {
    owner,
    users,
    diamondDawnMine,
  };
}

async function deployInitializedMine10() {
  const { diamondDawnMine, owner, users } = await deployMine();
  const diamondDawn = users.pop();
  await diamondDawnMine.connect(diamondDawn).initialize(10);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    users,
  };
}

async function deployInitializedMine10WithVideos() {
  const { diamondDawn, diamondDawnMine, owner, users } =
    await deployInitializedMine10();
  await setAllManifests(diamondDawnMine);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    users,
  };
}

async function deployMineWithVideos() {
  const { diamondDawnMine, diamondDawn, owner, users } = await deployMine();
  await setAllManifests(diamondDawnMine);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    users,
  };
}

module.exports = {
  deployMine,
  deployInitializedMine10,
  deployInitializedMine10WithVideos,
  deployMineWithVideos,
};
