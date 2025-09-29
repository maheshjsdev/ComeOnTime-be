const mongoose = require("mongoose");
const Admin = require("../models/admin.modal");
const Designation = require('../models/designation.model');

// Generate userId
function generateUserId(name) {
  const cleanName = name.replace(/\s+/g, ""); // remove all spaces
  const prefix = cleanName.substring(0, 3).toUpperCase();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${random}`;
}



// Create Admin Controller
exports.createAdmin = async (req, res) => {
  try {
    const { name, dob, mobile, email, designationId } = req.body;

    // Validate required fields
    if (!name || !dob || !mobile || !email || !designationId) {
      return res.status(400).json({ status: false, message: "All fields are required." });
    }

    const userId = generateUserId(name);

    try {
      // Check if the designation exists
      const designation = await Designation.findById(designationId);
      if (!designation) {
        return res.status(400).json({ status: false, message: "Invalid designationId" });
      }

      const admin = await Admin.create({
        userId,
        name,
        dob,
        userRole: "1",
        mobile,
        email,
        designationId: designation._id, // Store ObjectId
        password: "password@123"
      });

      res.status(201).json({ status: true, message: "Admin created successfully", data: admin });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        res.status(200).json({ status: true, message: "Email already exists" });
      } else {
        res.status(500).json({ status: false, message: err.message });
      }
    }
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


// Get All Admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-password")
      .populate({
        path: "designationId",
        select: "designationName"
      });

    const result = admins.map(admin => {
      let designation = admin.designationId;
      return {
        ...admin.toObject(),
        designationId: designation?._id || null,
        designationName: designation?.designationName || null
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// Get Admin by userId
exports.getAdminByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const admin = await Admin.findOne({ userId })
      .select("-password")
      .populate({
        path: "designationId",
        select: "designationName"
      });

    if (!admin) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    const designation = admin.designationId;
    const result = {
      ...admin.toObject(),
      designationId: designation?._id || null,
      designationName: designation?.designationName || null
    };

    res.json({ status: true, data: result });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


// Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const admin = await Admin.findOneAndUpdate({ userId }, updateData, { new: true });
    if (!admin) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    res.json({ status: true, data: admin });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const admin = await Admin.findOneAndDelete({ userId });
    if (!admin) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    res.json({ status: true, message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
