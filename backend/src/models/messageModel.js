const pool = require('../db/pool');

async function createMessage({ chatId, role, content }) {
  const res = await pool.query(
    `
      INSERT INTO messages (chat_id, role, content)
      VALUES ($1, $2, $3)
      RETURNING id, role, content, created_at
    `,
    [chatId, role, content],
  );
  return res.rows[0];
}

async function listMessagesByChatId({ userId, chatId }) {
  const res = await pool.query(
    `
      SELECT m.id, m.role, m.content, m.created_at
      FROM messages m
      INNER JOIN chats c ON c.id = m.chat_id
      WHERE c.user_id = $1 AND c.id = $2
      ORDER BY m.created_at ASC
    `,
    [userId, chatId],
  );
  return res.rows;
}

module.exports = {
  createMessage,
  listMessagesByChatId,
};

