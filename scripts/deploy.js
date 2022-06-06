// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
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
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const PhysicalToDigital = await hre.ethers.getContractFactory("PhysicalToDigital");
  const physicalToDigital = await PhysicalToDigital.deploy();
  await physicalToDigital.deployed();

  console.log("PhysicalToDigital contract address:", physicalToDigital.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(physicalToDigital);
}

function saveFrontendFiles(physicalToDigital) {
  const fs = require("fs");
  const contractsDir = `${__dirname}/../frontend/src/contracts`;

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Token: physicalToDigital.address }, undefined, 2)
  );

  const PhysicalToDigitalArtifact = hre.artifacts.readArtifactSync("PhysicalToDigital");

  fs.writeFileSync(
    contractsDir + "/PhysicalToDigital.json",
    JSON.stringify(PhysicalToDigitalArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
