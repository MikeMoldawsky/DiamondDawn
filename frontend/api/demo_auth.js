module.exports = async function (req, res) {
  const { pwd } = req.body
  res.send({ auth: pwd && pwd === process.env.DEMO_PASSWORD });
};
