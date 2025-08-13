const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, default: '' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	// Add more fields as needed for CRDT, users, etc.
});

module.exports = mongoose.model('Document', DocumentSchema);
