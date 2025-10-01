const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema(
    {
        userId: { type: String, unique: true },
        productName: { type: String, required: true }, // renamed
        userRole: { type: String, required: true, default: "ServiceProvider" }, // fixed
        mobile: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, default: "password@123" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SuperAdmin", superAdminSchema, "SuperAdmin");
