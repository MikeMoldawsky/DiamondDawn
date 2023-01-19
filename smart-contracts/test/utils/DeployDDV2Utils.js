const { ethers } = require("hardhat");

async function deployRevealPhase() {
  const RevealPhase = await ethers.getContractFactory("RevealPhase");
  const revealPhase = await RevealPhase.deploy();
  await revealPhase.deployed();
  return {
    revealPhase,
  };
}

async function deployKeyPhase() {
  const KeyPhase = await ethers.getContractFactory("KeyPhase");
  const keyPhase = await KeyPhase.deploy();
  await keyPhase.deployed();
  return {
    keyPhase,
  };
}

async function deployDDV2() {
  const users = await ethers.getSigners();
  const owner = users.shift();
  const signer = users.pop();
  const DiamondDawnV2 = await ethers.getContractFactory("DiamondDawnV2");
  const { revealPhase } = await deployRevealPhase();
  const diamondDawnV2 = await DiamondDawnV2.deploy(
    signer.address,
    revealPhase.address
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
  deployRevealPhase,
  deployKeyPhase,
};
