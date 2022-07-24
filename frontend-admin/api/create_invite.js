const { createInvite } = require("../../db/invite-db-manager");

module.exports = async function (req, res) {
  const invite = await createInvite();
  res.send(JSON.stringify(invite));
};
