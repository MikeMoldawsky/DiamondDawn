const {setStageStartTime} = require("frontend/db/stage-db-manager");

module.exports = async function (req, res) {
	const { stage, startsAt } = req.body;
	res.send(JSON.stringify(await setStageStartTime(stage, startsAt)));
};
