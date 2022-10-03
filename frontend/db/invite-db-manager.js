const InviteModel = require("./models/InviteModel");
const SignatureModel = require("./models/SignatureModel");
const add = require("date-fns/add");
const ethers = require("ethers");

const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY);

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

    if (invite.used) {
      console.log("openInvite - invite used", { invite });
      return { invite };
    }

    if (invite.revoked) {
      console.log("openInvite - invite revoked", { invite });
      return { invite };
    }

    await InviteModel.findOneAndUpdate(
      { _id: inviteId },
      {
        opened: invite.opened || Date.now(),
        location: `${state}, ${country}`,
      }
    );

    return await getInviteObjectById(inviteId);
  } catch (e) {
    console.log(`Failed to create invite`, e);
  }
}

async function signInvite(inviteId, address) {
  // check that the invite exist and not revoked or expired
  const invite = await getInviteObjectById(inviteId);
  if (!invite || invite.revoked || invite.used) {
    throw new Error(
      `signInvite failed - invite not found, revoked or used - "${inviteId}"`
    );
  }
  if (!ethers.utils.isAddress(address)) {
    throw new Error(
      `signInvite failed - invalid Ethereum address - "${address}"`
    );
  }

  let signature = await SignatureModel.findOne({ address });
  let sig;
  if (signature) {
    sig = signature.sig;
  } else {
    // Convert provided `ethAddress` to correct checksum address format.
    // This step is critical as signing an incorrectly formatted wallet address
    // can result in invalid signatures when it comes to minting.
    let addr = ethers.utils.getAddress(address);

    // Create the message to be signed using the checksum formatted `addr` value.
    let message = ethers.utils.arrayify(`0x${addr.slice(2).padStart(64, "0")}`);

    // Sign the message using `signer`.
    sig = await signer.signMessage(message);

    // Save Signature to DB
    await SignatureModel.create({ address, sig });

    // Save ethAddress and n invite
    await InviteModel.findOneAndUpdate(
      { _id: inviteId },
      { ethAddress: address }
    );
  }

  return {
    invite: await getInviteObjectById(inviteId),
    signature: sig,
  };
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
  signInvite,
  confirmInviteUsed,
};
