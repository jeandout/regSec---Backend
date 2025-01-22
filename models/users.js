const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, unique: true },
    role: { 
      type: String, 
      enum: ['admin', 'organizer', 'participant'], 
      default: 'participant' 
    },
    preferences: Object,
    currentLocation: Object,
    createdAt: Date,
  });

const User = mongoose.model('users', userSchema);

module.exports = User;