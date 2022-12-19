const clientDBPromise = require("../db/client/connection");
const { viewInvite } = require("../db/managers/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    await clientDBPromise;
    const { inviteId } = req.body;
    res.send(await viewInvite(inviteId));
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
