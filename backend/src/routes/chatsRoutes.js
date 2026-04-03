const express = require('express');
const chatsController = require('../controllers/chatsController');
const requireAuth = require('../middleware/requireAuth');
const authOptional = require('../middleware/authOptional');

const router = express.Router();

router.get('/', authOptional, requireAuth, chatsController.listChats);
router.get('/:id', authOptional, requireAuth, chatsController.getChatMessages);

module.exports = router;

