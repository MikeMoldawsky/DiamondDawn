const {openInvite} = require("../db/invite-db-manager");

module.exports = async function (req, res) {
	const inviteId = req.body.inviteId;
	const updatedInvite = await openInvite(inviteId);
	res.send(JSON.stringify({password: updatedInvite.password}));
};
