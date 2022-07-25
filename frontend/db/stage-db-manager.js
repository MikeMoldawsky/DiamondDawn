const StageModel = require("./models/StageModel");

async function getAllStages() {
	try {
		return await StageModel.find();
	} catch (e) {
		console.log(`Failed to get stages`, e);
	}
}

module.exports = {
	getAllStages
};
