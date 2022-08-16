const PasswordModel = require('./models/PasswordModel')
const _ = require('lodash')

async function createPasswords(numPasswords) {
  try {
    let passwords = []
    _.fill(passwords, { status: 'available' }, 0, numPasswords)

    return await PasswordModel.insertMany(passwords);
  } catch (e) {
    console.log(`Failed to CREATE Passwords`, e);
  }
}