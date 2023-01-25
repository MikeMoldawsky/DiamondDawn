const { ethers } = require("hardhat");

async function signMessage(signer, user) {
  try {
    // Convert provided `ethAddress` to correct checksum address format.
    // This step is critical as signing an incorrectly formatted wallet address
    // can result in invalid signatures when it comes to minting.
    const addressNoHex = ethers.utils.getAddress(user.address).slice(2);
    // Create the message to be signed using the checksum formatted `addr` value.
    const message = ethers.utils.arrayify(
      `0x${addressNoHex.padStart(64, "0")}`
    );
    // Sign the message using `signer`.
    return await signer.signMessage(message);
  } catch (e) {
    console.log("Failed to get signature");
    throw e;
  }
}

async function signMessageWithNumber(signer, user, number) {
  try {
    // Convert provided `ethAddress` to correct checksum address format.
    // This step is critical as signing an incorrectly formatted wallet address
    // can result in invalid signatures when it comes to minting.
    const addressNoHex = ethers.utils.getAddress(user.address).slice(2);
    const numberStr = number
      .toString(16)
      .padStart(64 - addressNoHex.length, "0");
    const message = ethers.utils.arrayify(`0x${addressNoHex}${numberStr}`);
    // Sign the message using `signer`.
    return await signer.signMessage(message);
  } catch (e) {
    console.log("Failed to get signature");
    throw e;
  }
}

module.exports = {
  signMessage,
  signMessageWithNumber,
};
