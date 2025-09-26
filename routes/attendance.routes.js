const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');

router.get('/', attendanceController.getAttendance);
router.post('/', attendanceController.markAttendance);

module.exports = router;
