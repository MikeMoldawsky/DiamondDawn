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

async function isCorrectPwd(password) {
	try {
		const invite = await InviteModel.findOne({ password: parseInt(password) });
		return !!invite;
	} catch (e) {
		console.log(`Failed to check password`, e);
	}
}

module.exports = {
	openInvite,
	isInviteRevoked,
	isCorrectPwd,
};
