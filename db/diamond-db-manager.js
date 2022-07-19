const DiamondModel = require('./models/DiamondModel');

async function getDiamonds() {
  try {
    return await DiamondModel.find();
  } catch (e) {
    console.log(`Failed to get all diamonds`, e);
  }
}

async function createDiamond(diamondProps) {
  try {
    const diamond = new DiamondModel(diamondProps);
    return await diamond.save();
  } catch (e) {
    console.log(`Failed to create Diamond`, e);
  }
}

async function updateDiamond(diamondProps) {
  try {
    return await DiamondModel.findOneAndUpdate({ _id: diamondProps._id }, diamondProps, { new: true });
  } catch (e) {
    console.log(`Failed to update Diamond`, e);
  }
}

module.exports = {
  getDiamonds,
  createDiamond,
  updateDiamond,
}