const Designation = require('../models/designation.model');

exports.getAllDesignations = async (req, res) => {
  try {
    const designations = await Designation.find();
    res.json(designations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDesignation = async (req, res) => {
  try {
    const { designationName } = req.body;
    if (!designationName) return res.status(400).json({ error: 'designationName required' });
    const designation = await Designation.create({ designationName });
    res.status(201).json(designation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { designationName } = req.body;
    const designation = await Designation.findByIdAndUpdate(id, { designationName }, { new: true });
    if (!designation) return res.status(404).json({ error: 'Designation not found' });
    res.json(designation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await Designation.findByIdAndDelete(id);
    if (!designation) return res.status(404).json({ error: 'Designation not found' });
    res.json({ message: 'Designation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
