const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
	try {
		const tasks = await Task.find().populate('assignedTo');
		res.json(tasks);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createTask = async (req, res) => {
       try {
	       const task = new Task(req.body);
	       await task.save();
	       res.status(201).json(task);
       } catch (err) {
	       console.error('Error in createTask:', err);
	       res.status(400).json({ error: err.message });
       }
};

exports.updateTask = async (req, res) => {
	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!task) return res.status(404).json({ error: 'Task not found' });
		res.json(task);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.deleteTask = async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) return res.status(404).json({ error: 'Task not found' });
		res.json({ message: 'Task deleted' });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
