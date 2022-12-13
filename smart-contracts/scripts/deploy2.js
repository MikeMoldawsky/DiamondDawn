// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const { ethers } = require("ethers");
const abi = require("../artifacts/contracts/DiamondDawnMine.sol/DiamondDawnMine.json");

const contractAddress = "0x5c76f4b4d3417f0fdFfc37e1FD9b46eD57cC306d";

async function main() {
  try{
  
    // Note that the script needs the ABI which is generated from the compilation artifact.
  const metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'artifacts/contracts/DiamondDawnMine.sol/DiamondDawnMine.json'))
  const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
  console.log(`signer`, {signer, web3Provider});
  
  // const kukuk = ethers.getDefaultProvider()
  // console.log(`kukuk`, kukuk);
  // let contract = new web3.eth.Contract(metadata.abi, contractAddress);
  // console.log(`contract`, contract == null);

  // const signer = await provider.getSigner()
  // contract = new ethers.Contract(contractAddress, abi, signer)

  // console.log(`populating ${DIAMONDS_1_200.length} diamonds`, DIAMONDS_1_200);
  // await mine.eruption(DIAMONDS_1_200);
  // console.log(
  //   `populating ${DIAMONDS_201_333.length} diamonds`,
  //   DIAMONDS_201_333
  // );
  // await mine.eruption(DIAMONDS_201_333);
  } catch(e){
    console.log("Failed to erupt diamonds", e)

  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => console.log("Successfully run of deploy Diamond Dawn"))
  .catch(error => {
    console.log("Failed", error);
    console.error(error);
    process.exitCode = 1;
  });
