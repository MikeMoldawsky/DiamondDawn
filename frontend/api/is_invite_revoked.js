const {isInviteRevoked} = require("../db/invite-db-manager");

module.exports = async function (req, res) {
	const inviteId = req.body.inviteId;
	const revoked = await isInviteRevoked(inviteId);
	res.send(JSON.stringify(revoked));
};
