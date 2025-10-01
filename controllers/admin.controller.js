const mongoose = require("mongoose");
const Admin = require("../models/admin.modal");
const Role = require("../models/role.model");
const SuperAdmin = require('../models/superadmin.model');

// Helper: PascalCase and generate UserId
function generateUserId(companyName) {
  const pascalCaseName = companyName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  const randomDigits = Math.floor(100 + Math.random() * 900); // 100–999
  return `${pascalCaseName}${randomDigits}`;
}

// CREATE Admin
exports.createAdmin = async (req, res) => {
  try {
    const { companyName, registrationNumber, mobile, email, password } = req.body;

    if (!companyName || !registrationNumber || !mobile || !email) {
      return res.status(400).json({ status: false, message: "All fields are required." });
    }

    const userId = generateUserId(companyName);

    const admin = await Admin.create({
      userId,
      companyName,
      registrationNumber,
      userRole: '2',
      mobile,
      email,
      password: password || "password@123"
    });

    res.status(201).json({
      status: true,
      message: "Admin created successfully",
      data: {
        ...admin.toObject(),
        roleId: '2',
        roleName: 'Admin'
      }
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ status: false, message: "Email already exists" });
    }
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET All Admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    const result = await Promise.all(admins.map(async admin => {
      // const role = await Role.findOne({ roleId: admin.userRole });
      return {
        ...admin.toObject(),
        roleId: '2',
        roleName: 'Admin'
      };
    }));

    res.json({ status: true, data: result });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET Admin by userId
exports.getAdminByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const admin = await Admin.findOne({ userId }).select("-password");
    if (!admin) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    // const role = await Role.findOne({ roleId: admin.userRole });

    res.json({
      status: true,
      data: {
        ...admin.toObject(),
        roleId: '2',
        roleName: 'Admin'
      }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { userId, companyName, registrationNumber, mobile, email, password } = req.body;

    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const updateData = { companyName, registrationNumber, mobile, email };
    if (password) updateData.password = password;

    if (companyName) {
      updateData.userId = generateUserId(companyName);
    }

    const updatedAdmin = await Admin.findOneAndUpdate({ userId }, updateData, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    // const role = await Role.findOne({ roleId: updatedAdmin.userRole });

    res.json({
      status: true,
      message: "Admin updated successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { userId, superAdminId } = req.body;

    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const superAdmin = await SuperAdmin.findOne({ userId: superAdminId });
    if (!superAdmin) {
      return res.status(403).json({ status: false, message: "You are not super admin" });
    }

    const admin = await Admin.findOneAndDelete({ userId });
    if (!admin) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    return res.status(200).json({ status: true, message: "Admin deleted successfully" });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

