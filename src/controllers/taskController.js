const Task = require('../models/Task');
const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

function parseValidDate(val) {
	if (!val) return null;
	const d = new Date(val);
	return Number.isNaN(d.getTime()) ? null : d;
}

exports.getAllTasks = async (req, res) => {
       try {
	       const tasks = await Task.find({ createdBy: req.User.id }).populate('assignedTo');
	       res.json(tasks);
       } catch (err) {
	       res.status(500).json({ error: err.message });
       }
};

exports.getTaskById = async (req, res) => {
       try {
	       const task = await Task.findOne({ _id: req.params.id, createdBy: req.User.id }).populate('assignedTo');
	       if (!task) return res.status(404).json({ error: 'Task not found or not authorized' });
	       res.json(task);
       } catch (err) {
	       res.status(400).json({ error: err.message });
       }
};

exports.getLabels = async (req, res) => {
	try {
		const labels = await Task.distinct('labels', { createdBy: req.User.id });
		const clean = (labels || []).flat().map(l => String(l).trim()).filter(Boolean);
		res.json(Array.from(new Set(clean)));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createTask = async (req, res) => {
       try {
 	       const payload = { ...req.body, createdBy: req.User.id };

	       // validate priority
	       if (payload.priority && !ALLOWED_PRIORITIES.includes(payload.priority)) {
		 return res.status(400).json({ error: 'Invalid priority value' });
	       }

	       // validate dueDate
	       if (payload.dueDate) {
		 const parsed = parseValidDate(payload.dueDate);
		 if (!parsed) return res.status(400).json({ error: 'Invalid dueDate format' });
		 payload.dueDate = parsed;
	       }

	       if (payload.labels && !Array.isArray(payload.labels)) {
		 payload.labels = String(payload.labels).split(',').map(s => s.trim()).filter(Boolean);
	       }
	       const task = new Task(payload);
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
	       // validate priority
	       if (req.body.priority && !ALLOWED_PRIORITIES.includes(req.body.priority)) {
		 return res.status(400).json({ error: 'Invalid priority value' });
	       }

	       // validate dueDate
	       if (req.body.dueDate) {
		 const parsed = parseValidDate(req.body.dueDate);
		 if (!parsed) return res.status(400).json({ error: 'Invalid dueDate format' });
		 req.body.dueDate = parsed;
	       }

	       if (req.body.labels && !Array.isArray(req.body.labels)) {
		 req.body.labels = String(req.body.labels).split(',').map(s => s.trim()).filter(Boolean);
	       }
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
