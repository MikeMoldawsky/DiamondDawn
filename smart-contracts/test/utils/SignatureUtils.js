const { ethers } = require("hardhat");

async function getSignature(signer, user) {
  try {
    // Convert provided `ethAddress` to correct checksum address format.
    // This step is critical as signing an incorrectly formatted wallet address
    // can result in invalid signatures when it comes to minting.
    const addr = ethers.utils.getAddress(user.address);

    // Create the message to be signed using the checksum formatted `addr` value.
    const message = ethers.utils.arrayify(
      `0x${addr.slice(2).padStart(64, "0")}`
    );
    // Sign the message using `signer`.
    return await signer.signMessage(message);
  } catch (e) {
    console.log("Failed to get signature");
    throw e;
  }
}

module.exports = {
  getSignature,
};
