const User = require('../models/user.model');

function generateUserId(name) {
    const prefix = name.substring(0, 3).toUpperCase();
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
        const user = await User.create({
            userId,
            username,
            fatherName,
            mobile,
            email,
            userRole: '3',
            dob,
            designationId
        });
        res.status(201).json(user);
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
    res.json({ message: 'User updated' });
};

exports.deleteUser = (req, res) => {
    res.json({ message: 'User deleted' });
};
