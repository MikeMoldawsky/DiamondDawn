const StageModel = require("./models/StageModel");

async function setStageStartTime(stage, startsAt) {
	const dateTime = new Date(startsAt)
	try {
		let dbStage = await StageModel.findOne({ stage })
		if (dbStage) {
			return await StageModel.findOneAndUpdate({ stage }, {  startsAt: dateTime });
		}
		else {
			return await StageModel.create({ stage, startsAt: dateTime })
		}
	} catch (e) {
		console.log(`Failed to upsert stage`, e);
	}
}

async function getAllStages() {
	try {
		return await StageModel.find();
	} catch (e) {
		console.log(`Failed to get stages`, e);
	}
}

module.exports = {
	setStageStartTime,
	getAllStages,
};
