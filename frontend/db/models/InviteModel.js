const Chance = require('chance');
const mongoose = require('mongoose')
const db = require('../db')

var chance = new Chance();

const InviteSchema = new mongoose.Schema({
	revoked: {type: Boolean, required: true, default: false},
	created: {type: Date, required: true, default: Date.now},
	password: {type: Number, required: true, default: () => chance.integer({ min: 100000, max: 999999 })},
	opened: {type: Date},

})

const InviteModel = db.model('Invite', InviteSchema)

module.exports = InviteModel
