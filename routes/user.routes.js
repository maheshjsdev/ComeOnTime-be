
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/create', authMiddleware, userController.createUser);
router.get('/getAllUser', authMiddleware, userController.getAllUsers); 
router.get('/', authMiddleware, userController.getUserById);
router.post('/update', authMiddleware, userController.updateUser);
router.post('/delete', authMiddleware, userController.deleteUser);

module.exports = router;
