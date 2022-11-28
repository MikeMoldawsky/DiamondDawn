const { getInviteById } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    const { inviteId } = req.body;
    res.send(await getInviteById(inviteId));
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
