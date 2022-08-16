const PasswordModel = require('./models/PasswordModel')
const _ = require('lodash')

async function createPasswords(numPasswords) {
  try {
    const passwords = _.fill(Array(numPasswords), { status: 'available' })
    return await PasswordModel.insertMany(passwords);
  } catch (e) {
    console.log(`Failed to CREATE Passwords`, e);
  }
}

async function countPasswords(status) {
  try {
    return await PasswordModel.countDocuments({ status });
  } catch (e) {
    console.log(`Failed to COUNT Passwords`, e);
  }
}
module.exports = {
  createPasswords,
  countPasswords,
}