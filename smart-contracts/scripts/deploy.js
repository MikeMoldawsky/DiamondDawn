// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const mongoose = require("mongoose");
const { updateDiamondDawnContract } = require("../db/contract-db-manager");
const ethers = hre.ethers

async function deployMintPhase() {
  const MintPhase = await ethers.getContractFactory("MintPhase");
  const mintPhase = await MintPhase.deploy("mine-manifest");
  await mintPhase.deployed();
  return {
    mintPhase,
  };
}

async function main() {
  if (!hre.network.name || hre.network.name === "hardhat") {
    throw new Error(`Wrong network: ${hre.network.name}`);
  }

  const DiamondDawnV2 = await ethers.getContractFactory("DiamondDawn");
  const { mintPhase } = await deployMintPhase();
  const diamondDawnV2 = await DiamondDawnV2.deploy(
    process.env.DEV_DEPLOYMENT_SIGNER_PUBLIC_KEY,
    mintPhase.address
  );
  await diamondDawnV2.deployed();

  // Update FrontEnd database
  await updateDiamondDawnContract(diamondDawnV2.address);

  if (hre.network.name === "localhost") {
    // local network - activate and open "mint" phase
    await diamondDawnV2.setActive(true);
    await diamondDawnV2.safeOpenPhase();
  }

  await mongoose.disconnect(); // build doesn't finish without disconnect
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => console.log("Successfully run of deploy Diamond Dawn"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
