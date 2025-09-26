const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  widgets: [{ type: String }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dashboard', dashboardSchema);
