const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designation.controller');

router.get('/', designationController.getAllDesignations);
router.post('/create', designationController.createDesignation);
router.put('/update/:id', designationController.updateDesignation);
router.delete('/delete/:id', designationController.deleteDesignation);

module.exports = router;
