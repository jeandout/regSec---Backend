const mongoose = require('mongoose');

const yearSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    route: Object,
  });

const Year = mongoose.model('years', yearSchema);

module.exports = Year;