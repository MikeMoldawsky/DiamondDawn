const InviteModel = require("./models/InviteModel");
const PasswordModel = require("./models/PasswordModel");
const add = require("date-fns/add");

async function getInviteObjectById(inviteId) {
  try {
    const invite = (await InviteModel.findById(inviteId)).toObject();
    if (
      invite &&
      invite.opened &&
      process.env.REACT_APP_INVITE_TTL_SECONDS > 0
    ) {
      invite.expires = add(invite.opened, {
        seconds: process.env.REACT_APP_INVITE_TTL_SECONDS,
      });

      if (invite.expires < new Date()) {
        invite.revoked = true;
        console.log("Invite expired", { invite });
      }
    }

    return invite;
  } catch (e) {
    console.log(`Failed to get invite ${inviteId}`, e);
  }
}

async function openInvite(inviteId, country, state) {
  try {
    // check that the invite exist and not revoked or expired
    const invite = await getInviteObjectById(inviteId);
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

    await InviteModel.findOneAndUpdate(
      { _id: inviteId },
      {
        opened: invite.opened || Date.now(),
        location: `${state}, ${country}`,
      }
    );

    return {
      invite: await getInviteObjectById(inviteId),
      password: password.password,
    };
  } catch (e) {
    console.log(`Failed to create invite`, e);
  }
}

async function useInvite(inviteId, ethAddress) {
  try {
    // check that the invite exist and not revoked or expired
    const invite = await getInviteObjectById(inviteId);
    if (!invite || invite.revoked) {
      console.log("useInvite - invite not found or revoked", { inviteId });
      return null;
    }

    await InviteModel.findOneAndUpdate({ _id: inviteId }, { ethAddress });

    return await getInviteObjectById(inviteId);
  } catch (e) {
    console.log(`Failed to create invite`, e);
  }
}

async function confirmInviteUsed(inviteId) {
  try {
    // check that the invite exist and not revoked or expired
    const invite = await getInviteObjectById(inviteId);
    if (!invite || invite.revoked) {
      console.log("confirmInviteUsed - invite not found or revoked", {
        inviteId,
      });
      return null;
    }

    await InviteModel.findOneAndUpdate({ _id: inviteId }, { used: true });

    return await getInviteObjectById(inviteId);
  } catch (e) {
    console.log(`Failed to create invite`, e);
  }
}

module.exports = {
  getInviteObjectById,
  openInvite,
  useInvite,
  confirmInviteUsed,
};
