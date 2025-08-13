const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	avatar: { type: String },
	bio: { type: String, default: '' },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
