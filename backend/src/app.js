const express = require('express');
const cors = require('cors');

const env = require('./config/env');
const chatRoutes = require('./routes/chatRoutes');
const chatsRoutes = require('./routes/chatsRoutes');
const authRoutes = require('./routes/authRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow missing origin (e.g. curl) and allow localhost dev ports.
        if (!origin) return callback(null, true);
        if (env.FRONTEND_ORIGIN === '*') return callback(null, true);
        const isLocalhost = /^http:\/\/localhost:\d+$/i.test(origin);
        if (isLocalhost) return callback(null, true);
        if (origin === env.FRONTEND_ORIGIN) return callback(null, true);
        return callback(null, false);
      },
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use('/chat', chatRoutes);
  app.use('/chats', chatsRoutes);
  app.use('/auth', authRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;

