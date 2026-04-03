const chatService = require('../services/chatService');

async function listChats(req, res, next) {
  try {
    const chats = await chatService.listChats({ user: req.user });
    return res.json({ chats });
  } catch (err) {
    return next(err);
  }
}

async function getChatMessages(req, res, next) {
  try {
    const { id } = req.params;
    const messages = await chatService.getChatMessages({
      user: req.user,
      chatId: id,
    });
    return res.json({ messages });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listChats,
  getChatMessages,
};

