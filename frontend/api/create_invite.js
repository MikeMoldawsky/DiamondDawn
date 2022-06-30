const {createInvite} = require("../db/invite-db-manager");

module.exports = async function (req, res) {
	const reason = req.body.reason;
	const invite = await createInvite(reason);
	res.send(JSON.stringify(invite));
};
