
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/login', userController.loginUser); // No auth for login
router.post('/create', authMiddleware, userController.createUser);
router.get('/', authMiddleware, userController.getAllUsers); // Disabled for security
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/update', authMiddleware, userController.updateUser);
router.post('/delete', authMiddleware, userController.deleteUser);

module.exports = router;
