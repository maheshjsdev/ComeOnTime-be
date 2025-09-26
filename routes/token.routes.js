const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/token.controller');

router.post('/generate', tokenController.generateToken);

module.exports = router;
