const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, unique: true },
    fonction: String,
    settings: Object,
  });

const User = mongoose.model('users', userSchema);

module.exports = User;