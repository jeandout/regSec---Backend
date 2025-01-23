const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  locations: { type: [Object], default: [] },
});

const Position = mongoose.model('positions', positionSchema);

module.exports = Position;