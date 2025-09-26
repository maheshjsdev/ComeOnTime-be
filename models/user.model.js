const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    fatherName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userRole: { type: String, required: true, default: '3' },
    dob: { type: Date, required: true },
    designationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation', required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'User');
