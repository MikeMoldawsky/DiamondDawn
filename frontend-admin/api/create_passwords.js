const { createPasswords } = require("../db/password-db-manager");

module.exports = async function (req, res) {
  const result = await createPasswords(req.body.numPasswords);
  res.send(result);
};
