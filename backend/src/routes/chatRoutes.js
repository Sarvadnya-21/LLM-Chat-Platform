const express = require('express');
const chatController = require('../controllers/chatController');
const guestLimit = require('../middleware/guestLimit');
const authOptional = require('../middleware/authOptional');

const router = express.Router();

router.post('/', authOptional, guestLimit, chatController.postChat);

module.exports = router;

