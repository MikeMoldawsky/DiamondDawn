const DiamondModel = require('./models/DiamondModel');

async function createDiamond(diamondProps) {
  try {
    const diamond = new DiamondModel(diamondProps);
    return await diamond.save();
  } catch (e) {
    console.log(`Failed to CREATE Diamond`, e);
  }
}

async function getDiamonds() {
  try {
    return await DiamondModel.find();
  } catch (e) {
    console.log(`Failed to READ all diamonds`, e);
  }
}

async function updateDiamond(diamondProps) {
  try {
    return await DiamondModel.findOneAndUpdate({ _id: diamondProps._id }, diamondProps, { new: true });
  } catch (e) {
    console.log(`Failed to UPDATE Diamond`, e);
  }
}

async function deleteDiamond(diamondId) {
  try {
    return await DiamondModel.findOneAndDelete({ _id: diamondId });
  } catch (e) {
    console.log(`Failed to DELETE Diamond`, e);
  }
}

module.exports = {
  getDiamonds,
  createDiamond,
  updateDiamond,
  deleteDiamond,
}