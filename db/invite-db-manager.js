const InviteModel = require("./models/InviteModel");

async function createInvite() {
	try {
		const guildCommunityBotModel = new InviteModel({});
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

async function updateInvite(inviteProps) {
	try {
		return await InviteModel.findOneAndUpdate({ _id: inviteProps._id }, inviteProps, { new: true });
	} catch (e) {
		console.log(`Failed to UPDATE Invite`, e);
	}
}

async function deleteInvite(inviteId) {
	try {
		return await InviteModel.findOneAndDelete({ _id: inviteId });
	} catch (e) {
		console.log(`Failed to DELETE Invite`, e);
	}
}

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
	createInvite,
	openInvite,
	getInvites,
	isInviteRevoked,
	isCorrectPwd,
	updateInvite,
	deleteInvite,
};
