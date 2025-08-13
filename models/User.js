const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Profile fields
  firstName: { type: String },
  lastName: { type: String },
  name: { type: String },
  avatar: { type: String }, // URL to avatar image
  bio: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
