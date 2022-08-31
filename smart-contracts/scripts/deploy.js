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
const {
  DIAMOND_DAWN_TYPE,
  NO_SHAPE_NUM,
  SHAPE,
  ROUGH_SHAPE,
} = require("./utils/EnumConverterUtils");

const DIAMONDS = [
  {
    number: 1111111111,
    date: 1659254421,
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
    number: 2222222222,
    date: 1659254421,
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
    number: 3333333333,
    date: 1659254421,
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
    number: 3333333333,
    date: 1659254421,
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
    number: 3333333333,
    date: 1659254421,
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
    number: 3333333333,
    date: 1659254421,
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
    number: 3333333333,
    date: 1659254421,
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
  let deployerBalance = await deployer.getBalance();
  let deployerNewBalance;

  console.log("Deploying DiamondDawn contracts", {
    deployerAddress,
    deployerBalance: deployerBalance.toString(),
    deployerEthBalance: ethers.utils.formatEther(deployerBalance),
    network: hre.network.name,
  });

  const DiamondDawnMine = await hre.ethers.getContractFactory(
    "DiamondDawnMine"
  );
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
  let diamondDawn;
  if (hre.network.name === "localhost") {
    // Populate diamonds and images in local host
    await setVideos(diamondDawnMine);
    diamondDawn = await DiamondDawn.deploy(
      diamondDawnMine.address,
      DIAMONDS.length
    );
    console.log(`populating ${DIAMONDS.length} diamonds`, DIAMONDS);
    await diamondDawnMine.eruption(DIAMONDS);
    await diamondDawn.unpause();
  } else {
    // Goerli
    diamondDawn = await DiamondDawn.deploy(diamondDawnMine.address, 333);
  }
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

  // TODO: remove in production admins
  const admins = process.env.ADMINS?.split(" ") || [];
  if (!admins.includes(deployerAddress)) {
    admins.push(deployerAddress);
  }
  console.log("Adding admins to DD & DDM", admins);
  const adminRole = await diamondDawn.DEFAULT_ADMIN_ROLE();
  await Promise.all(
    admins.map(async (admin) => await diamondDawn.grantRole(adminRole, admin))
  );
  const adminRoleMine = await diamondDawn.DEFAULT_ADMIN_ROLE();
  await Promise.all(
    admins.map(
      async (admin) => await diamondDawnMine.grantRole(adminRoleMine, admin)
    )
  );

  if (hre.network.name === "goerli") {
    try {
      console.log("Verifying DiamondDawnMine contract");
      await hre.run("verify:verify", {
        address: diamondDawnMine.address,
        constructorArguments: [],
      });

      console.log("Verifying DiamondDawn contract");
      await hre.run("verify:verify", {
        address: diamondDawn.address,
        constructorArguments: [diamondDawnMine.address],
      });
      console.log("Successfully verified the contract");
    } catch (e) {
      console.log("Failed to verify contract", e);
    }
  }
}

async function setVideos(diamondDawnMine) {
  await diamondDawnMine.setTypeVideos(DIAMOND_DAWN_TYPE.ENTER_MINE, [
    { shape: NO_SHAPE_NUM, video: "infinity.mp4" },
  ]);
  await diamondDawnMine.setTypeVideos(DIAMOND_DAWN_TYPE.ROUGH, [
    { shape: ROUGH_SHAPE.MAKEABLE_1, video: "rough_1.mp4" },
    { shape: ROUGH_SHAPE.MAKEABLE_2, video: "rough_2.mp4" },
  ]);
  await diamondDawnMine.setTypeVideos(DIAMOND_DAWN_TYPE.CUT, [
    { shape: SHAPE.PEAR, video: "cut_pear.mp4" },
    { shape: SHAPE.ROUND, video: "cut_round.mp4" },
    { shape: SHAPE.OVAL, video: "cut_oval.mp4" },
    { shape: SHAPE.RADIANT, video: "cut_radiant.mp4" },
  ]);
  await diamondDawnMine.setTypeVideos(DIAMOND_DAWN_TYPE.POLISHED, [
    { shape: SHAPE.PEAR, video: "polished_pear.mp4" },
    { shape: SHAPE.ROUND, video: "polished_round.mp4" },
    { shape: SHAPE.OVAL, video: "polished_oval.mp4" },
    { shape: SHAPE.RADIANT, video: "polished_radiant.mp4" },
  ]);
  await diamondDawnMine.setTypeVideos(DIAMOND_DAWN_TYPE.REBORN, [
    { shape: NO_SHAPE_NUM, video: "diamond_dawn.mp4" },
  ]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => console.log("Successfully run of deploy Diamond Dawn"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
