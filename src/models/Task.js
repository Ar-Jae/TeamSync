const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	dueDate: { type: Date },
	priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
	labels: { type: [String], default: [] },
	completed: { type: Boolean, default: false },
	status: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
	assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', TaskSchema);
