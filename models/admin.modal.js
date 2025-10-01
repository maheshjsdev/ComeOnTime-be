const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        userId: { type: String, unique: true },
        companyName: { type: String, required: true }, // renamed
        registrationNumber: { type: String, required: true, unique: true }, // new
        userRole: { type: String },
        mobile: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, default: "password@123" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema, "Admin");
