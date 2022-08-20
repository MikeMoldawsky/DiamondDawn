const InviteModel = require("./models/InviteModel");
const PasswordModel = require("./models/PasswordModel");
const add = require("date-fns/add");

async function openInvite(inviteId, country, state) {
  try {
    // check that the invite exist and not revoked or expired
    let invite = await InviteModel.findById(inviteId);
    if (!invite) {
      console.log("openInvite - invite not found", { inviteId });
      return null;
    }
    if (invite.revoked) {
      console.log("openInvite - invite revoked", { invite });
      return { invite };
    }
    // TODO - handle invite expiration

    // get password
    const password = await PasswordModel.findOneAndUpdate(
      { status: "available" },
      { status: "pending" }
    );

    const updatedInvite = await InviteModel.findOneAndUpdate(
      { _id: inviteId },
      {
        // TODO - uncomment this
        // revoked: true,
        opened: Date.now(),
        location: `${state}, ${country}`,
      }
    );

    return { invite: updatedInvite, password: password.password };
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

async function getPassword(inviteId) {
  try {
    const invite = await InviteModel.findById(inviteId);
    console.log("Getting password for invite", { invite });
    if (
      invite &&
      !invite.revoked &&
      invite.opened &&
      add(invite.opened, { hours: 12 }) > new Date()
    ) {
      const password = await PasswordModel.findOneAndUpdate(
        { status: "available" },
        { status: "pending" }
      );
      console.log(`Got password for invite`, { invite, password });
      return password;
    }
  } catch (e) {
    console.log(`Failed to check password`, e);
  }
  return null;
}

module.exports = {
  openInvite,
  isInviteRevoked,
  isCorrectPwd,
  getPassword,
};
