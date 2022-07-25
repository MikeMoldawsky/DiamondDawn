const InviteModel = require("./models/InviteModel");

async function openInvite(inviteId, country, state) {
	try {
		return await InviteModel.findOneAndUpdate({_id: inviteId}, {revoked: true, opened: Date.now(), location: `${state}, ${country}`});
	} catch (e) {
		console.log(`Failed to create invite`, e);
	}
}

async function isInviteRevoked(inviteId) {
	try {
		const invite = await InviteModel.findById(inviteId).exec();
		return invite.revoked;
	} catch (e) {
		console.log(`Failed to create invite`, e);
	}
}

module.exports = {
	openInvite,
	isInviteRevoked
};
