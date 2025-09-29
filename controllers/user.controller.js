const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
        return res.status(400).json({ status: false, message: 'userId and password required' });
    }
    try {
        const user = await User.findOne({ userId });
        if (!user || user.password !== password) {
            return res.status(401).json({ status: false, message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.userId, role: user.userRole }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
        res.status(200).json({ status: true, token });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
const User = require('../models/user.model');

function generateUserId(name) {
  const cleanName = name.replace(/\s+/g, ""); // remove all spaces
  const prefix = cleanName.substring(0, 3).toUpperCase();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${random}`;
}

exports.createUser = async (req, res) => {
    try {
        const { username, fatherName, mobile, email, dob, designationId } = req.body;
        if (!username || !fatherName || !mobile || !email || !dob || !designationId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const userId = generateUserId(username);
        try {
            const user = await User.create({
                userId,
                username,
                fatherName,
                mobile,
                email,
                userRole: '3',
                dob,
                designationId,
                password: 'password@123'
            });
            res.status(201).json({ status: true, message: "Data added successfully" });
        } catch (err) {
            if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
                res.status(200).json({ status: true, message: "email already exist" });
            } else {
                res.status(500).json({ status: false, message: err.message });
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate({
            path: 'designationId',
            select: 'designationName'
        });
        // Map users to include both designationId and designationName
        const result = users.map(user => {
            let designation = user.designationId;
            return {
                ...user.toObject(),
                designationId: designation?._id || null,
                designationName: designation?.designationName || null
            };
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = (req, res) => {
    res.json({});
};

exports.updateUser = (req, res) => {
    const { userId, ...updateData } = req.body;
    const User = require('../models/user.model');
    User.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }
            res.status(200).json({ status: true, message: 'Data updated successfully' });
        })
        .catch(err => {
            if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
                res.status(200).json({ status: true, message: 'email already exist' });
            } else {
                res.status(500).json({ status: false, message: err.message });
            }
        });
};

exports.deleteUser = (req, res) => {
    const { userId, roleId } = req.body;
    if (![1, 2].includes(Number(roleId))) {
        return res.status(403).json({ status: false, message: 'Permission denied' });
    }
    const User = require('../models/user.model');
    User.findOneAndDelete({ userId })
        .then(user => {
            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }
            res.status(200).json({ status: true, message: 'Data deleted successfully' });
        })
        .catch(err => {
            res.status(500).json({ status: false, message: err.message });
        });
};
