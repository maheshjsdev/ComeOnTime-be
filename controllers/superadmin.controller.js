const SuperAdmin = require("../models/superadmin.model");

// helper: convert to PascalCase
const toPascalCase = (str) => {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "") // remove special characters
    .split(/\s+/) // split by space
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};


// CREATE (POST type)
exports.createSuperAdmin = async (req, res) => {
  try {
    const { productName, mobile, email, password } = req.body;

    if (!productName || !mobile || !email) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    const userId = toPascalCase(productName);

    // Check if already exists
    const existing = await SuperAdmin.findOne({ userId });
    if (existing) {
      return res.status(400).json({ status: false, message: "SuperAdmin already exists" });
    }

    const newSuperAdmin = new SuperAdmin({
      userId,
      productName,
      mobile,
      email,
      password: password || "password@123",
      userRole: "ServiceProvider"
    });

    await newSuperAdmin.save();

    res.status(201).json({ status: true, message: "SuperAdmin created", data: newSuperAdmin });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


// UPDATE (POST type)
exports.updateSuperAdmin = async (req, res) => {
  try {
    const { userId, productName, mobile, email, password } = req.body;

    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const updateData = { productName, mobile, email };
    if (password) updateData.password = password;

    if (productName) {
      updateData.userId = toPascalCase(productName);
    }

    const updated = await SuperAdmin.findOneAndUpdate({ userId }, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ status: false, message: "SuperAdmin not found" });
    }

    res.status(200).json({ status: true, message: "SuperAdmin updated", data: updated });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


// DELETE (POST type)
exports.deleteSuperAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const deleted = await SuperAdmin.findOneAndDelete({ userId });

    if (!deleted) {
      return res.status(404).json({ status: false, message: "SuperAdmin not found" });
    }

    res.status(200).json({ status: true, message: "SuperAdmin deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


// GET by userId (GET type)
exports.getSuperAdminByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const superAdmin = await SuperAdmin.findOne({ userId });

    if (!superAdmin) {
      return res.status(404).json({ status: false, message: "SuperAdmin not found" });
    }

    res.status(200).json({ status: true, data: superAdmin });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

