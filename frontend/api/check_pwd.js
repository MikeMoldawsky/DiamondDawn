const { isCorrectPwd } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const password = req.body.password;
  const isCorrect = await isCorrectPwd(password);
  res.send(isCorrect);
};
