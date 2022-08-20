import { utils as ethersUtils } from "ethers/lib/ethers";
const PasswordModel = require("./models/PasswordModel");
const _ = require("lodash");

async function createPasswords(numPasswords) {
  try {
    const passwords = _.fill(Array(numPasswords), { status: "available" });
    const bdPasswords = await PasswordModel.insertMany(passwords);
    console.log("createPasswords - added passwords to db", { bdPasswords });
    const hashes = bdPasswords.map(({ password }) => {
      const packed = ethersUtils.solidityPack(["uint"], [password]);
      return ethersUtils.solidityKeccak256(["string"], [packed]);
    });
    console.log("createPasswords - generated hashes", { bdPasswords });
    return hashes;
  } catch (e) {
    console.log(`Failed to CREATE Passwords`, e);
  }
}

async function countPasswords(status) {
  try {
    return await PasswordModel.countDocuments({ status });
  } catch (e) {
    console.log(`Failed to COUNT Passwords`, e);
  }
}
module.exports = {
  createPasswords,
  countPasswords,
};
