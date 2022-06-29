const InviteModel = require("./models/InviteModel");


async function createInviteDocument() {
	try {
		const document = {};
		const guildCommunityBotModel = new InviteModel(document);
		return await guildCommunityBotModel.save();
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
	createInviteDocument,
	getInvites
};
