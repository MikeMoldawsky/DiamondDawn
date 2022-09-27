const { ethers } = require("hardhat");

async function getSignature(signer, user) {
  // Convert provided `ethAddress` to correct checksum address format.
  // This step is critical as signing an incorrectly formatted wallet address
  // can result in invalid signatures when it comes to minting.
  let addr = ethers.utils.getAddress(user.address);

  // Create the message to be signed using the checksum formatted `addr` value.
  let message = ethers.utils.arrayify(`0x${addr.slice(2).padStart(64, "0")}`);

  // Sign the message using `signer`.
  return await signer.signMessage(message);
}

module.exports = {
  getSignature,
};
