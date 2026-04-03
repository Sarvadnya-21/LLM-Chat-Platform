const env = require('./config/env');
const createApp = require('./app');
const { initDb } = require('./db/initDb');

async function start() {
  await initDb();
  const app = createApp();

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on port ${env.PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start backend:', err);
  process.exit(1);
});

// Restarting nodemon to connect to real Ollama AI
