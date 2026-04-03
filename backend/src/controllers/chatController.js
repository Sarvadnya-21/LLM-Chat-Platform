const chatService = require('../services/chatService');

async function postChat(req, res, next) {
  try {
    const { message, chatId } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await chatService.postChat({
      user: req.user,
      message,
      chatId: chatId || null,
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  postChat,
};

