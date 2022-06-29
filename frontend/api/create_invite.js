const {createInviteDocument} = require("../db/invite-db-manager");

module.exports = async function (req, res) {
	const invite = await createInviteDocument();
	res.send(JSON.stringify(invite));
};