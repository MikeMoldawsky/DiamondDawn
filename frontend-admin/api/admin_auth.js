module.exports = async function (req, res) {
  const start = Date.now();
  const { pwd } = req.body;
  res.send({ auth: pwd && process.env.ADMIN_PASSWORD && pwd === process.env.ADMIN_PASSWORD });
  console.log(`Execution time: ${Date.now() - start} ms`);
};
