const express = require('express');
const authController = require('../controllers/authController');
const authOptional = require('../middleware/authOptional');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authOptional, authController.me);

module.exports = router;

