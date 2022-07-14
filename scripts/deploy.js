// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  hre.network.name = process.env.NETWORK;
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
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const royality = 1000; // 1000/10000 = 10/100 = 10 %

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const DiamondDawn = await hre.ethers.getContractFactory("DiamondDawn");
  const diamondDawn = await DiamondDawn.deploy(royality);
  await diamondDawn.deployed();

  console.log("DiamondDawn contract address:", diamondDawn.address);

  // We also save the contract's artifacts and address in the frontend directory
  const contractsDir = `${__dirname}/../frontend/src/contracts`;
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
