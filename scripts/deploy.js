// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const path = require("path");
const { ethers } = require("ethers");
const mongoose = require("mongoose");
const { updateDiamondDawnContract } = require("../db/contract-db-manager");

async function main() {
  if (!hre.network.name) {
    console.error(
      "network name is NOT defined. It should be passed as an environment variable"
    );
    return;
  }

  // This is just a convenience check
  if (hre.network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const admins = process.env.ADMINS?.split(" ") || [];
  const royalty = 1000; // 1000/10000 = 10/100 = 10 %
  
  let deployerBalance = await deployer.getBalance();
  let deployerNewBalance;
  
  console.log("Deploying DiamondDawn contracts", {
    deployerAddress,
    admins,
    royalty,
    deployerBalance: deployerBalance.toString(),
    deployerEthBalance: ethers.utils.formatEther(deployerBalance),
    network: hre.network.name,
  });

  const DiamondDawnMine = await hre.ethers.getContractFactory("DiamondDawnMine");
  const diamondDawnMine = await DiamondDawnMine.deploy();
  await diamondDawnMine.deployed();
  deployerNewBalance = await deployer.getBalance();

  console.log("DiamondDawnMine contract successfully deployed", {
    address: diamondDawnMine.address,
    deployerBalance: deployerNewBalance.toString(),
    deployerEthBalance: ethers.utils.formatEther(deployerNewBalance),
    deploymentEthCost: ethers.utils.formatEther(
      deployerBalance.sub(deployerNewBalance)
    ),
  });

  deployerBalance = deployerNewBalance;

  const DiamondDawn = await hre.ethers.getContractFactory("DiamondDawn");
  const diamondDawn = await DiamondDawn.deploy(royalty, diamondDawnMine.address, admins);
  await diamondDawn.deployed();
  deployerNewBalance = await deployer.getBalance();

  console.log("DiamondDawn contract successfully deployed", {
    address: diamondDawn.address,
    deployerBalance: deployerNewBalance.toString(),
    deployerEthBalance: ethers.utils.formatEther(deployerNewBalance),
    deploymentEthCost: ethers.utils.formatEther(
      deployerBalance.sub(deployerNewBalance)
    ),
  });
  const DiamondDawnArtifact = hre.artifacts.readArtifactSync("DiamondDawn");
  console.log("Updating db with DiamondDawn artifacts");
  await updateDiamondDawnContract(diamondDawn.address, DiamondDawnArtifact);
  // TODO(mike): check what's the best way to create & close a connection with mongoose
  await mongoose.disconnect(); // build doesn't finish without disconnect
  // We also save the contract's artifacts and address in the frontend directory
  console.log("Successfully updated db with DiamondDawn artifacts");
  if (hre.network.name === "goerli") {
    try {
      console.log("Verifying DiamondDawnMine contract");
      await hre.run("verify:verify", {
        address: diamondDawn.address,
        constructorArguments: [royalty, admins],
      });
      console.log("Successfully verified the contract");
    } catch (e) {
      console.log("Failed to verify contract", e);
    }

    try {
      console.log("Verifying DiamondDawn contract");
      await hre.run("verify:verify", {
        address: diamondDawn.address,
        constructorArguments: [royalty, admins],
      });
      console.log("Successfully verified the contract");
    } catch (e) {
      console.log("Failed to verify contract", e);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => console.log("Successfully run of deploy Diamond Dawn"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
