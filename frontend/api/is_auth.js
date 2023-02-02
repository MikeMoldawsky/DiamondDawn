const clientDBPromise = require("../db/client/connection");
const { validateInviteById } = require("../db/managers/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    await clientDBPromise;
    const { inviteId } = req.body;
    console.log("IS_AUTH CALLED");
    const invite = await validateInviteById(inviteId);
    res.send({ auth: !!invite });
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
