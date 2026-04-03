const pool = require('../db/pool');

async function createChat({ userId, title }) {
  const res = await pool.query(
    `
      INSERT INTO chats (user_id, title)
      VALUES ($1, $2)
      RETURNING id, title, created_at
    `,
    [userId, title || null],
  );
  return res.rows[0];
}

async function listChatsByUserId({ userId }) {
  const res = await pool.query(
    `
      SELECT id, title, created_at
      FROM chats
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId],
  );
  return res.rows;
}

async function findChatByIdForUser({ userId, chatId }) {
  const res = await pool.query(
    `
      SELECT id, title, created_at
      FROM chats
      WHERE user_id = $1 AND id = $2
      LIMIT 1
    `,
    [userId, chatId],
  );
  return res.rows[0] || null;
}

module.exports = {
  createChat,
  listChatsByUserId,
  findChatByIdForUser,
};

