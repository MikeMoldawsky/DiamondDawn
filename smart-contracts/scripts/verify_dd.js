// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function verifyContract(address, args) {
  const taskArgs = { address: address, constructorArguments: args };
  try {
    console.log("Verifying contract", taskArgs);
    await hre.run("verify:verify", taskArgs);
  } catch (e) {
    console.log("Failed to verify contract", { taskArgs, e });
  }
}

async function main() {
  // Diamond Dawn
  const ddArgs = [
    "0xF404758cA17E54841181F3d3C0aF872444e80306",
    "0x00a1B3ED1Cc7CD797879e7FeDc24A0DA0Fa9D699",
  ];
  await verifyContract("0x65fC1247AC5194e9636d5F389b5a9272E19cf548", ddArgs);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => console.log("Successfully run of deploy Diamond Dawn"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
