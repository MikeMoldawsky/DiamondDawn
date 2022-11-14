module.exports = async function (req, res) {
  const { pwd, inviteId } = req.body;
  res.send({ auth: pwd && (pwd === process.env.DEMO_PASSWORD || (inviteId && pwd === inviteId.substring(inviteId.length - 8))) });
};
