const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");

// GET requests
router.get("/", authMiddleware, adminController.getAdmins);
router.get("/:userId", authMiddleware, adminController.getAdminByUserId); // updated

// POST requests
router.post("/create", authMiddleware, adminController.createAdmin);
router.post("/update", authMiddleware, adminController.updateAdmin);
router.post("/delete", authMiddleware, adminController.deleteAdmin);

module.exports = router;
