const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Admin = require('../models/admin.modal');
const SuperAdmin = require('../models/superadmin.model'); 
exports.generateToken = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res
        .status(400)
        .json({ status: false, message: 'userId and password required' });
    }

    let user = null;
    let roleName = null;

    // 1. Try SuperAdmin
    user = await SuperAdmin.findOne({ userId });
    if (user && user.password === password) {
      roleName = 'SuperAdmin';
    }

    // 2. Try Admin
    if (!user) {
      user = await Admin.findOne({ userId });
      if (user && user.password === password) {
        roleName = 'Admin';
      }
    }

    // 3. Try User
    if (!user) {
      user = await User.findOne({ userId });
      if (user && user.password === password) {
        roleName = 'User';
      }
    }

    // If still not found or password mismatch
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ status: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, role: roleName, roleId: user.userRole },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      status: true,
      token,
      roleId: user.userRole,
      roleName,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
