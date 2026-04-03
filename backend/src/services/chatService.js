const aiService = require('./aiService');
const env = require('../config/env');
const chatModel = require('../models/chatModel');
const messageModel = require('../models/messageModel');

function deriveTitleFromMessage(message) {
  const trimmed = String(message || '').trim();
  if (!trimmed) return null;
  return trimmed.length > 50 ? `${trimmed.slice(0, 50)}...` : trimmed;
}

async function getChatReply({ message }) {
  if (env.USE_MOCK_RESPONSE) {
    return `Mocked response: ${message}`;
  }

  return aiService.generateReply({ message });
}

async function postChat({ user, message, chatId }) {
  // Guests: no chat persistence; just generate a reply.
  if (!user) {
    const reply = await getChatReply({ message });
    return { reply, chatId: null };
  }

  const userId = user.id;
  let chat = null;

  if (chatId) {
    chat = await chatModel.findChatByIdForUser({ userId, chatId });
    if (!chat) {
      const e = new Error('Chat not found');
      e.statusCode = 404;
      throw e;
    }
  } else {
    chat = await chatModel.createChat({
      userId,
      title: deriveTitleFromMessage(message),
    });
  }

  await messageModel.createMessage({
    chatId: chat.id,
    role: 'user',
    content: message,
  });

  const reply = await getChatReply({ message });

  await messageModel.createMessage({
    chatId: chat.id,
    role: 'assistant',
    content: reply,
  });

  return { reply, chatId: chat.id };
}

async function listChats({ user }) {
  if (!user) return [];
  return chatModel.listChatsByUserId({ userId: user.id });
}

async function getChatMessages({ user, chatId }) {
  if (!user) return [];
  return messageModel.listMessagesByChatId({ userId: user.id, chatId });
}

module.exports = {
  postChat,
  listChats,
  getChatMessages,
};

