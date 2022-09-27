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

async function getSignature(signer, user) {
  // Convert provided `ethAddress` to correct checksum address format.
  // This step is critical as signing an incorrectly formatted wallet address
  // can result in invalid signatures when it comes to minting.
  let addr = ethers.utils.getAddress(user.address);

  // Create the message to be signed using the checksum formatted `addr` value.
  let message = ethers.utils.arrayify(`0x${addr.slice(2).padStart(64, "0")}`);

  // Sign the message using `signer`.
  return await signer.signMessage(message);
}

async function deployDD() {
  const { diamondDawnMine, owner, user1, user2, signer } = await deployMine();
  const ownerSig = await getSignature(signer, owner);
  const sig1 = await getSignature(signer, user1);
  const sig2 = await getSignature(signer, user2);
  const DiamondDawn = await ethers.getContractFactory("DiamondDawn");
  const diamondDawn = await DiamondDawn.deploy(
    diamondDawnMine.address,
    MAX_TOKENS,
    signer.address
  );
  await diamondDawn.deployed();
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
    user2,
    ownerSig,
    sig1,
    sig2,
  };
}

async function deployDDWithMineReady() {
  const {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
    user2,
    ownerSig,
    sig1,
    sig2,
  } = await deployDD();
  await prepareMineReady(diamondDawnMine, MAX_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
    user2,
    ownerSig,
    sig1,
    sig2,
  };
}

async function deployDDWithCutReady() {
  const {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
    user2,
    ownerSig,
    sig1,
    sig2,
  } = await deployDD();
  await prepareCutReady(diamondDawnMine, MAX_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
    user2,
    ownerSig,
    sig1,
    sig2,
  };
}

async function deployDDWithPolishReady() {
  const {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
    user2,
    ownerSig,
    sig1,
    sig2,
  } = await deployDD();
  await preparePolishReady(diamondDawnMine, MAX_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
    user2,
    ownerSig,
    sig1,
    sig2,
  };
}

async function deployDDWithRebirthReady() {
  const {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
    user2,
    ownerSig,
    sig1,
    sig2,
  } = await deployDD();
  await prepareRebirthReady(diamondDawnMine, MAX_TOKENS);
  return {
    diamondDawn,
    diamondDawnMine,
    owner,
    user1,
    user2,
    ownerSig,
    sig1,
    sig2,
  };
}

module.exports = {
  deployDD,
  deployDDWithMineReady,
  deployDDWithCutReady,
  deployDDWithPolishReady,
  deployDDWithRebirthReady,
  MAX_TOKENS,
};
