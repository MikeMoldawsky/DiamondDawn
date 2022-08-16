const { getPassword } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const inviteId = req.body.inviteId;
  const password = await getPassword(inviteId);
  res.send(password?.password);
};
