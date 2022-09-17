const { expect } = require("chai");

async function assertOnlyAdmin(unAuthUser, mineContract, unAuthFunction) {
  const adminRole = await mineContract.DEFAULT_ADMIN_ROLE();
  return expect(
    unAuthFunction(mineContract.connect(unAuthUser))
  ).to.be.revertedWith(
    `AccessControl: account ${unAuthUser.address.toLowerCase()} is missing role ${adminRole}`
  );
}

module.exports = { assertOnlyAdmin };
