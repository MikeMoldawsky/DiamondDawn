const InviteModel = require("./models/InviteModel");
const PasswordModel = require("./models/PasswordModel");
const add = require("date-fns/add");

const INVITE_TTL_SECONDS = 30;

async function getAndValidateInvite(inviteId) {
  let invite = await InviteModel.findById(inviteId);

  if (
    invite
    && !invite.revoked
    && invite.opened
    && INVITE_TTL_SECONDS > 0) {

    const expires = add(invite.opened, { seconds: INVITE_TTL_SECONDS })
    console.log('Checking if invite expired', { invite, now: new Date(), opened: invite.opened, expires: expires })

    if (expires < new Date()) {
      console.log('Invite expired', { invite })
      await InviteModel.findByIdAndUpdate(inviteId, { revoked: true })
      invite = await InviteModel.findById(inviteId);
    }

    invite.expires = expires
  }

  return invite
}

async function openInvite(inviteId, country, state) {
  try {
    // check that the invite exist and not revoked or expired
    const invite = await getAndValidateInvite(inviteId);
    if (!invite) {
      console.log("openInvite - invite not found", { inviteId });
      return null;
    }

    if (invite.revoked) {
      console.log("openInvite - invite revoked", { invite });
      return { invite };
    }

    // get password
    const password = await PasswordModel.findOneAndUpdate(
      { status: "available" },
      { status: "pending" }
    );

    const updatedInvite = await InviteModel.findOneAndUpdate(
      { _id: inviteId },
      {
        // revoked: true,
        opened: invite.opened || Date.now(),
        location: `${state}, ${country}`,
      }
    );

    return { invite: updatedInvite, password: password.password, ttl: INVITE_TTL_SECONDS };
  } catch (e) {
    console.log(`Failed to create invite`, e);
  }
}

async function isInviteRevoked(inviteId) {
  try {
    const invite = await getAndValidateInvite(inviteId);

    return !invite || invite.revoked;
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
    const invite = await getAndValidateInvite(inviteId);

    console.log("Getting password for invite", { invite });
    if (invite && !invite.revoked && invite.opened) {
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
