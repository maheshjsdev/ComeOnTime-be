const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.get('/get', authMiddleware, roleController.getAllRoles);
router.post('/create', authMiddleware, roleController.createRole);
router.post('/delete', authMiddleware, roleController.deleteRole);
router.post('/update', authMiddleware, roleController.updateRole);

module.exports = router;
