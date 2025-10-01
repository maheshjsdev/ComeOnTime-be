const Designation = require('../models/designation.model');

// ✅ Get all designations by companyId
exports.getAllDesignations = async (req, res) => {
  try {
    const { companyId } = req.query;
    const designations = await Designation.find({ companyId });

    if (designations.length === 0) {
      return res.status(200).json({
        status: true,
        data: [],
        message: "No designations found"
      });
    }

    res.status(200).json({
      status: true,
      data: designations,
      message: "Designations fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
};


// ✅ Create designation with duplicate check
exports.createDesignation = async (req, res) => {
  try {
    const { companyId, designationName } = req.body;

    if (!designationName) {
      return res.status(200).json({ status: false, error: 'designationName required' });
    }

    // Check duplicate within same company
    const existing = await Designation.findOne({ designationName, companyId });
    if (existing) {
      return res.status(200).json({ status: false, error: 'Designation already exists' });
    }

    const designation = await Designation.create({ designationName, companyId });
    res.status(200).json({ status: true, data: designation, message: 'Designation created successfully' });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// ✅ Update designation with duplicate check
exports.updateDesignation = async (req, res) => {
  try {
    const { companyId, id, designationName } = req.body;

    if (!id) return res.status(200).json({ status: false, error: 'id required' });
    if (!designationName) return res.status(200).json({ status: false, error: 'designationName required' });

    // Check duplicate (exclude current id)
    const duplicate = await Designation.findOne({
      designationName,
      companyId,
      _id: { $ne: id }
    });

    if (duplicate) {
      return res.status(200).json({ status: false, error: 'Designation with this name already exists' });
    }

    const designation = await Designation.findOneAndUpdate(
      { _id: id, companyId },
      { designationName },
      { new: true }
    );

    if (!designation) {
      return res.status(200).json({ status: false, error: 'Designation not found' });
    }

    res.status(200).json({ status: true, data: designation, message: 'Designation updated successfully' });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};


// Delete designation (id comes from body now)
exports.deleteDesignation = async (req, res) => {
  try {
    const { companyId, id } = req.body;

    if (!id) {
      return res.status(200).json({ status: false, error: 'id required' });
    }

    const designation = await Designation.findOneAndDelete({ _id: id, companyId });

    if (!designation) {
      return res.status(200).json({ status: false, error: 'Designation not found' });
    }

    return res.status(200).json({ status: true, message: 'Designation deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

