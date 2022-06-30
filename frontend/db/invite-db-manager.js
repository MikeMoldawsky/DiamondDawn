const InviteModel = require("./models/InviteModel");


async function createInvite() {
	try {
		const document = {};
		const guildCommunityBotModel = new InviteModel(document);
		return await guildCommunityBotModel.save();
	} catch (e) {
		console.log(`Failed to create invite`, e);
	}
}


async function openInvite(inviteId) {
	try {
		return await InviteModel.findOneAndUpdate({_id: inviteId}, {revoked: true, opened: Date.now()});
	} catch (e) {
		console.log(`Failed to create invite`, e);
	}
}

async function getInvites() {
	try {
		return await InviteModel.find();
	} catch (e) {
		console.log(`Failed to get all invites`, e);
	}
}



module.exports = {
	createInvite,
	openInvite,
	getInvites
};
