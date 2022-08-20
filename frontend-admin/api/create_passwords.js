const { createPasswords } = require("../db/password-db-manager");

module.exports = async function (req, res) {
  const hashes = await createPasswords(req.body.numPasswords);
  res.send(hashes);
};
