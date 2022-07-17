// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const path = require("path");
const { ethers } = require("ethers");

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
  const deployerBalance = await deployer.getBalance();
  const admins = process.env.ADMINS?.split(" ") || [];
  const royalty = 1000; // 1000/10000 = 10/100 = 10 %
  console.log("Deploying DiamondDawn contract", {
    deployerAddress,
    admins,
    royalty,
    deployerBalance: deployerBalance.toString(),
    deployerEthBalance: ethers.utils.formatEther(deployerBalance),
    network: hre.network.name,
  });
  const DiamondDawn = await hre.ethers.getContractFactory("DiamondDawn");
  const diamondDawn = await DiamondDawn.deploy(royalty, admins);
  await diamondDawn.deployed();
  const deployerNewBalance = await deployer.getBalance();

  console.log("DiamondDawn contract successfully deployed", {
    address: diamondDawn.address,
    deployerBalance: deployerNewBalance.toString(),
    deployerEthBalance: ethers.utils.formatEther(deployerNewBalance),
    deploymentEthCost: ethers.utils.formatEther(
      deployerBalance - deployerNewBalance
    ),
  });

  await hre.run("verify:verify", {
    address: diamondDawn.address,
    constructorArguments: [royalty, admins],
  });

  // We also save the contract's artifacts and address in the frontend directory
  const contractsDir = path.resolve(__dirname, "../frontend/src/contracts");
  saveFrontendFiles(diamondDawn, contractsDir, hre.network.name);
}

function saveFrontendFiles(diamondDawn, contractsDir, network) {
  const fs = require("fs");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  const DiamondDawnArtifact = hre.artifacts.readArtifactSync("DiamondDawn");

  const contractObject = {};
  contractObject[network] = {
    address: diamondDawn.address,
    artifact: DiamondDawnArtifact,
  };

  fs.writeFileSync(
    contractsDir + "/DiamondDawn.json",
    JSON.stringify(contractObject, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
