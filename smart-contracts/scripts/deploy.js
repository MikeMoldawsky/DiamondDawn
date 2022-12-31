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
const { clearEruptionTxs } = require("../db/config-db-manager");
const { STAGE } = require("./utils/EnumConverterUtils");

const DIAMOND_OPTIONS = [
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
    length: 512,
    width: 512,
    depth: 350,
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
    length: 512,
    width: 512,
    depth: 350,
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
    length: 512,
    width: 512,
    depth: 350,
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
    length: 512,
    width: 512,
    depth: 350,
  },
];

const DIAMOND_COUNT = 333;

const DIAMONDS = [];
for (let i = 0; i < DIAMOND_COUNT; i++) {
  DIAMONDS.push({
    ...DIAMOND_OPTIONS[i % 4],
    number: 1000000000 + i,
  });
}

async function main() {
  if (!hre.network.name || hre.network.name === "hardhat") {
    throw new Error(`Wrong network: ${hre.network.name}`);
  }

  // Clear DB
  await clearEruptionTxs();
  const [deployer] = await hre.ethers.getSigners();
  // Diamond Dawn Mine
  const mineArgs = [];
  const SerializerLib = await hre.ethers.getContractFactory("Serializer");
  const serializer = await SerializerLib.deploy();
  const libraries = { Serializer: serializer.address };
  const mine = await deployContract(
    deployer,
    "DiamondDawnMine",
    mineArgs,
    libraries
  );
  // Diamond Dawn
  let dd;
  const ddArgs = [mine.address, process.env.DEV_DEPLOYMENT_SIGNER_PUBLIC_KEY];
  if (hre.network.name === "goerli") {
    dd = await deployContract(deployer, "DiamondDawn", ddArgs);
    // await populateDiamonds(mine);
  } else if (hre.network.name === "localhost") {
    await setVideos(mine);
    dd = await deployContract(deployer, "DiamondDawn", ddArgs);
    // await populateDiamonds(mine);
  }

  // Update FrontEnd database
  await updateDiamondDawnMineContract(mine.address);
  await updateDiamondDawnContract(dd.address);

  // TODO: remove in production admins
  if (hre.network.name === "goerli") {
    await grantAdminsForContracts(dd, mine);
    await verifyContract(mine, mineArgs);
    await verifyContract(dd, ddArgs);
  }
  // TODO(mike): check what's the best way to create & close a connection with mongoose
  await mongoose.disconnect(); // build doesn't finish without disconnect
}

async function deployContract(deployer, contractName, args, libraries) {
  const deployerAddress = await deployer.getAddress();
  const deployerBalance = await deployer.getBalance();
  console.log(`Deploying ${contractName}`, {
    deployerAddress,
    deployerBalance: deployerBalance.toString(),
    deployerEthBalance: ethers.utils.formatEther(deployerBalance),
    network: hre.network.name,
    args,
  });
  const factory = await hre.ethers.getContractFactory(contractName, {
    libraries,
  });
  const contract = await factory.deploy(...args);
  await contract.deployed();
  const deployerNewBalance = await deployer.getBalance();
  console.log(`${contractName} Deployed`, {
    address: contract.address,
    ethLeft: ethers.utils.formatEther(deployerNewBalance),
    deployerBalance: deployerNewBalance.toString(),
    ethCost: ethers.utils.formatEther(deployerBalance.sub(deployerNewBalance)),
  });
  return contract;
}

async function populateDiamonds(mine) {
  console.log(`populating ${DIAMONDS.length} diamonds`, DIAMONDS);
  await mine.eruption(DIAMONDS);
}

async function setVideos(diamondDawnMine) {
  await diamondDawnMine.setManifest(
    STAGE.KEY,
    "qz0rbe1jbAPbx0GHGVvBxeKdHGAvmRTGXXyAdpgN_HA"
  );
  await diamondDawnMine.setManifest(
    STAGE.MINE,
    "ROJj21Z-xdJ90lscyVvpBCIuYAFm8nQf0rF63KxqSBg"
  );
  await diamondDawnMine.setManifest(
    STAGE.CUT,
    "qIF9aJGqY8uOz55o-x-_q4LRdNc4YDjvuOO_iUFmqgk"
  );
  await diamondDawnMine.setManifest(
    STAGE.POLISH,
    "LzfNElWncGfBa5eIaFWZ3JxNYt95PvdHIr8t7MMHrU0"
  );
  await diamondDawnMine.setManifest(
    STAGE.DAWN,
    "dm4lEPAKKKLf-ZjghklqtVyODMZVynvM1Nsj8-vJnPs"
  );
}

async function verifyContract(contract, args) {
  const taskArgs = { address: contract.address, constructorArguments: args };
  try {
    console.log("Verifying contract", taskArgs);
    await hre.run("verify:verify", taskArgs);
  } catch (e) {
    console.log("Failed to verify contract", { taskArgs, e });
  }
}

async function grantAdminsForContracts(diamondDawn, diamondDawnMine) {
  const admins = process.env.DEV_DEPLOYMENT_ADMINS?.split(" ") || [];
  const adminRole = await diamondDawn.DEFAULT_ADMIN_ROLE();
  const adminRoleMine = await diamondDawn.DEFAULT_ADMIN_ROLE();
  for (const admin of admins) {
    console.log("Adding admin to DD & DDM", admin);
    let txn = await diamondDawn.grantRole(adminRole, admin);
    await txn.wait();
    txn = await diamondDawnMine.grantRole(adminRoleMine, admin);
    await txn.wait();
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
