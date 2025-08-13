// Get current user's profile
exports.getMe = async (req, res) => {
	   try {
		   const user = await User.findById(req.User.id);
		   if (!user) return res.status(404).json({ error: 'User not found' });
		   res.json({
			   id: user._id,
			   username: user.username,
			   email: user.email,
			   name: user.name,
			   firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
			   lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
			   avatar: user.avatar,
			   bio: user.bio,
			   createdAt: user.createdAt
		   });
	   } catch (err) {
		   res.status(500).json({ error: err.message });
	   }
};

// Update current user's profile
exports.updateMe = async (req, res) => {
	   try {
		   const update = { ...req.body };
		   if (update.firstName || update.lastName) {
			   update.name = (update.firstName || '') + (update.lastName ? ' ' + update.lastName : '');
		   }
		   const user = await User.findByIdAndUpdate(
			   req.User.id,
			   { $set: update },
			   { new: true }
		   );
		   if (!user) return res.status(404).json({ error: 'User not found' });
		   res.json({
			   id: user._id,
			   username: user.username,
			   email: user.email,
			   name: user.name,
			   firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
			   lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
			   avatar: user.avatar,
			   bio: user.bio,
			   createdAt: user.createdAt
		   });
	   } catch (err) {
		   res.status(400).json({ error: err.message });
	   }
};
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.createUser = async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).json(user);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.json(user);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.json({ message: 'User deleted' });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
