const { ethers } = require("hardhat");
const { MINT_MANIFEST, KEY_MANIFEST } = require("./consts");

async function deployMintPhase() {
  const MintPhase = await ethers.getContractFactory("MintPhase");
  const mintPhase = await MintPhase.deploy(MINT_MANIFEST);
  await mintPhase.deployed();
  return {
    mintPhase,
  };
}

async function deployKeyPhase() {
  const KeyPhase = await ethers.getContractFactory("KeyPhase");
  const keyPhase = await KeyPhase.deploy(KEY_MANIFEST);
  await keyPhase.deployed();
  return {
    keyPhase,
  };
}

async function deployDDV2() {
  const users = await ethers.getSigners();
  const owner = users.shift();
  const signer = users.pop();
  const DiamondDawnV2 = await ethers.getContractFactory("DiamondDawn");
  const { mintPhase } = await deployMintPhase();
  const diamondDawnV2 = await DiamondDawnV2.deploy(
    signer.address,
    mintPhase.address
  );
  await diamondDawnV2.deployed();
  return {
    diamondDawnV2,
    owner,
    signer,
    users,
  };
}

async function deployDDV2WithPhase(initialPhase) {
  const users = await ethers.getSigners();
  const owner = users.shift();
  const signer = users.pop();
  const DiamondDawnV2 = await ethers.getContractFactory("DiamondDawn");
  const diamondDawnV2 = await DiamondDawnV2.deploy(
    signer.address,
    initialPhase.address
  );

  await diamondDawnV2.deployed();
  return {
    diamondDawnV2,
    owner,
    signer,
    users,
  };
}

module.exports = {
  deployDDV2,
  deployMintPhase,
  deployKeyPhase,
  deployDDV2WithPhase,
};
