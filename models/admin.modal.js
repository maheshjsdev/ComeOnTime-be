const mongoose = require("mongoose");

// Function to generate userId
function generateUserId(name) {
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}${random}`;
}

const adminSchema = new mongoose.Schema(
    {
        userId: { type: String, unique: true },
        name: { type: String, required: true },
        dob: { type: Date, required: true },
        userRole: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, default: "password@123" },
        designationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema, "Admin");
