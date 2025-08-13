const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
       try {
	       const tasks = await Task.find({ createdBy: req.User.id }).populate('assignedTo');
	       res.json(tasks);
       } catch (err) {
	       res.status(500).json({ error: err.message });
       }
};

exports.createTask = async (req, res) => {
       try {
	       const task = new Task({ ...req.body, createdBy: req.User.id });
	       await task.save();
	       res.status(201).json(task);
       } catch (err) {
	       console.error('Error in createTask:', err);
	       res.status(400).json({ error: err.message });
       }
};

exports.updateTask = async (req, res) => {
       try {
	       const task = await Task.findOne({ _id: req.params.id, createdBy: req.User.id });
	       if (!task) return res.status(404).json({ error: 'Task not found or not authorized' });
	       Object.assign(task, req.body);
	       await task.save();
	       res.json(task);
       } catch (err) {
	       res.status(400).json({ error: err.message });
       }
};

exports.deleteTask = async (req, res) => {
       try {
	       const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.User.id });
	       if (!task) return res.status(404).json({ error: 'Task not found or not authorized' });
	       res.json({ message: 'Task deleted' });
       } catch (err) {
	       res.status(400).json({ error: err.message });
       }
};
