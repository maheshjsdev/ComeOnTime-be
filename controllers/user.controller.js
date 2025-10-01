const User = require('../models/user.model');
const Admin = require('../models/admin.modal');
const Role = require('../models/role.model');
const SuperAdmin = require('../models/superadmin.model');

// Helper to generate userId
function generateUserId(name) {
    const cleanName = name.replace(/\s+/g, "");
    const prefix = cleanName.substring(0, 3).toUpperCase();
    const random = Math.floor(100 + Math.random() * 90000); // last 3 digits
    return `${prefix}${random}`;
}

// Create User
exports.createUser = async (req, res) => {
    try {
        const { username, fatherName, mobile, email, dob, designationId, companyId } = req.body;

        if (!username || !fatherName || !mobile || !email || !dob || !designationId || !companyId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Verify companyId exists in Admin collection
        const company = await Admin.findOne({ userId: companyId });
        if (!company) {
            return res.status(400).json({ error: 'Invalid companyId' });
        }

        const userId = generateUserId(username);

        const user = await User.create({
            userId,
            username,
            fatherName,
            mobile,
            email,
            userRole: '3',
            companyId,
            dob,
            designationId,
            password: 'password@123'
        });

        res.status(201).json({ status: true, message: "User created successfully", data: user });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            res.status(200).json({ status: true, message: "Email already exists" });
        } else {
            res.status(500).json({ status: false, message: err.message });
        }
    }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const { companyId } = req.query;

        if (!companyId) {
            return res.status(400).json({ status: false, message: "companyId is invalid" });
        }

        const users = await User.find({ companyId })
            .select("-password") // exclude password
            .populate({
                path: 'designationId',
                select: 'designationName'
            });

        const results = await Promise.all(users.map(async (user) => {
            // const role = await Role.findOne({ roleId: user.userRole });
            const admin = await Admin.findOne({ userId: user.companyId });

            return {
                userId: user.userId,
                username: user.username,
                fatherName: user.fatherName,
                mobile: user.mobile,
                email: user.email,
                dob: user.dob,
                // userRole: user.userRole,
                roleId: "3",
                roleName: "Employee",
                designationId: user.designationId?._id || null,
                designationName: user.designationId?.designationName || null,
                companyId: user.companyId || null,
                companyName: admin?.companyName || null
            };
        }));

        res.json({ status: true, data: results });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};




// Get User by userId
exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ status: false, message: "userId is required" });
        }

        const user = await User.findOne({ userId })
            .select("-password") // exclude password
            .populate({
                path: 'designationId',
                select: 'designationName'
            });

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // const role = await Role.findOne({ roleId: user.userRole });
        const admin = await Admin.findOne({ userId: user.companyId });

        const result = {
            ...user.toObject(),
            roleId: "3",
            roleName: "Employee",
            designationId: user.designationId?._id || null,
            designationName: user.designationId?.designationName || null,
            companyName: admin?.companyName || null,
            companyId: admin?.companyId || null,
        };

        res.json({ status: true, data: result });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { userId, companyId, ...updateData } = req.body;

        if (!userId || !companyId) {
            return res.status(400).json({ status: false, message: "userId and companyId are required" });
        }

        // Check if company exists in Admin or SuperAdmin
        const company = await Admin.findOne({ userId: companyId }) || await SuperAdmin.findOne({ userId: companyId });
        if (!company) {
            return res.status(404).json({ status: false, message: "Company not found" });
        }

        // Allowed fields for both Admin and User
        const allowedFields = ["username", "fatherName", "mobile", "email", "dob", "password", "designationId"];

        const filteredUpdate = {};
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                filteredUpdate[field] = updateData[field];
            }
        });

        if (Object.keys(filteredUpdate).length === 0) {
            return res.status(400).json({ status: false, message: "No valid fields to update" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { userId },
            filteredUpdate,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        res.status(200).json({ status: true, message: "User updated successfully", data: updatedUser });

    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(200).json({ status: true, message: "Email already exists" });
        }
        res.status(500).json({ status: false, message: err.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { userId, companyId, companyPassword } = req.body;

        if (!userId || !companyId || !companyPassword) {
            return res.status(400).json({ status: false, message: "userId, companyId, and companyPassword are required" });
        }

        // Check in Admin model
        let company = await Admin.findOne({ userId: companyId, password: companyPassword });

        // If not found in Admin, check in SuperAdmin
        if (!company) {
            company = await SuperAdmin.findOne({ userId: companyId, password: companyPassword });
        }

        if (!company) {
            return res.status(403).json({ status: false, message: "Company not found or password incorrect" });
        }

        // Delete user if exists
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        await User.deleteOne({ userId });

        res.status(200).json({ status: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
