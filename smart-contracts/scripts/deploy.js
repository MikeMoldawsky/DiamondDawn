// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers } = require("ethers");
const mongoose = require("mongoose");
const {
  updateDiamondDawnContract,
  updateDiamondDawnMineContract,
} = require("../db/contract-db-manager");

async function main() {
  if (!hre.network.name) {
    console.error(
      "network name is NOT defined. It should be passed as an environment variable"
    );
    return;
  }

  console.info("Deploying Diamond Dawn contract", {
    network: hre.network.name,
  });

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
  if (!admins.includes(deployerAddress)) {
    admins.push(deployerAddress);
  }

  let deployerBalance = await deployer.getBalance();
  let deployerNewBalance;

  console.log("Deploying DiamondDawn contracts", {
    deployerAddress,
    admins,
    deployerBalance: deployerBalance.toString(),
    deployerEthBalance: ethers.utils.formatEther(deployerBalance),
    network: hre.network.name,
  });

  const DiamondDawnMine = await hre.ethers.getContractFactory(
    "DiamondDawnMine"
  );
  const diamondDawnMine = await DiamondDawnMine.deploy(admins);
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
  const diamondDawn = await DiamondDawn.deploy(diamondDawnMine.address, admins);
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

  // call DiamondDawnMine.initialize
  await diamondDawnMine.initialize(diamondDawn.address);
  /// ///////////////////////////////////////////////////
  //                  DEV ONLY                        //
  /// ///////////////////////////////////////////////////
  if (hre.network.name === "localhost") {
    const diamonds = [
      {
        reportNumber: 1111111111,
        reportDate: 1659254421,
        shape: 1,
        points: 55,
        color: 4,
        clarity: 5,
        cut: 2,
        polish: 1,
        symmetry: 3,
        fluorescence: 1,
        measurements: "5.12 - 5.12 x 3.50",
      },
      {
        reportNumber: 2222222222,
        reportDate: 1659254421,
        shape: 2,
        points: 70,
        color: 14,
        clarity: 4,
        cut: 3,
        polish: 3,
        symmetry: 3,
        fluorescence: 1,
        measurements: "5.12 - 5.12 x 3.50",
      },
      {
        reportNumber: 3333333333,
        reportDate: 1659254421,
        shape: 3,
        points: 45,
        color: 11,
        clarity: 2,
        cut: 3,
        polish: 2,
        symmetry: 2,
        fluorescence: 1,
        measurements: "5.12 - 5.12 x 3.50",
      },
      {
        reportNumber: 3333333333,
        reportDate: 1659254421,
        shape: 4,
        points: 66,
        color: 8,
        clarity: 1,
        cut: 1,
        polish: 2,
        symmetry: 1,
        fluorescence: 2,
        measurements: "5.12 - 5.12 x 3.50",
      },
      {
        reportNumber: 3333333333,
        reportDate: 1659254421,
        shape: 2,
        points: 35,
        color: 5,
        clarity: 1,
        cut: 1,
        polish: 1,
        symmetry: 1,
        fluorescence: 1,
        measurements: "5.12 - 5.12 x 3.50",
      },
      {
        reportNumber: 3333333333,
        reportDate: 1659254421,
        shape: 1,
        points: 49,
        color: 3,
        clarity: 1,
        cut: 1,
        polish: 1,
        symmetry: 1,
        fluorescence: 1,
        measurements: "5.12 - 5.12 x 3.50",
      },
      {
        reportNumber: 3333333333,
        reportDate: 1659254421,
        shape: 4,
        points: 59,
        color: 2,
        clarity: 1,
        cut: 1,
        polish: 1,
        symmetry: 1,
        fluorescence: 1,
        measurements: "5.12 - 5.12 x 3.50",
      },
    ];

    console.log(`populating ${diamonds.length} diamonds`, diamonds);
    await diamondDawnMine.diamondEruption(diamonds);
    await diamondDawnMine.setMineEntranceVideo("infinity.mp4");
    await diamondDawnMine.setRoughVideo("rough.mp4");
    await diamondDawnMine.setCutVideos(
      "cut_pear.mp4",
      "cut_round.mp4",
      "cut_oval.mp4",
      "cut_radiant.mp4"
    );
    await diamondDawnMine.setPolishVideos(
      "polished_pear.mp4",
      "polished_round.mp4",
      "polished_oval.mp4",
      "polished_radiant.mp4"
    );
    await diamondDawnMine.setRebirthVideo("diamond_dawn.mp4");
    await diamondDawn.unpause();
  }

  const DiamondDawnMineArtifact =
    hre.artifacts.readArtifactSync("DiamondDawnMine");
  console.log("Updating db with DiamondDawnMine artifact");
  await updateDiamondDawnMineContract(
    diamondDawnMine.address,
    DiamondDawnMineArtifact
  );
  const DiamondDawnArtifact = hre.artifacts.readArtifactSync("DiamondDawn");
  console.log("Updating db with DiamondDawn artifact");
  await updateDiamondDawnContract(diamondDawn.address, DiamondDawnArtifact);
  // TODO(mike): check what's the best way to create & close a connection with mongoose
  await mongoose.disconnect(); // build doesn't finish without disconnect

  console.log("Successfully updated db with DiamondDawn artifacts");

  if (hre.network.name === "goerli") {
    try {
      console.log("Verifying DiamondDawn contract");
      await hre.run("verify:verify", {
        address: diamondDawn.address,
        constructorArguments: [diamondDawnMine.address, admins],
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
