const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  designationName: { type: String, required: true },
  companyId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Designation', designationSchema, 'Designation');
