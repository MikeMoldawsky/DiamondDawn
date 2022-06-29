const mongoose = require('mongoose')
const db = require('../db')

const InviteSchema = new mongoose.Schema({
	revoked: {type: Boolean, required: true, default: false},
	created: {type: Date, required: true, default: Date.now},
	opened: {type: Date},
})

const InviteModel = db.model('Invite', InviteSchema)

module.exports = InviteModel