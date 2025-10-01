const express = require('express');
const router = express.Router();
const superController = require('../controllers/superadmin.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/get', authMiddleware, superController.getSuperAdminByUserId);
router.post('/create', authMiddleware, superController.createSuperAdmin);
router.post('/update', authMiddleware, superController.updateSuperAdmin);
router.post('/delete', authMiddleware, superController.deleteSuperAdmin);

module.exports = router;
