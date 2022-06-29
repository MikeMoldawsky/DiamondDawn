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

module.exports = {
	createInviteDocument
};
