const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designation.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, designationController.getAllDesignations);

router.post('/create', authMiddleware, designationController.createDesignation);
router.post('/update', authMiddleware, designationController.updateDesignation); 
router.post('/delete', authMiddleware, designationController.deleteDesignation); 

module.exports = router;
