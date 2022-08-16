const { countPasswords } = require("../db/password-db-manager");

module.exports = async function (req, res) {
  const passwordCount = await countPasswords();
  res.send(passwordCount);
};
