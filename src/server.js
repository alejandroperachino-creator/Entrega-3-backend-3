import mongoose from 'mongoose';
import app from './app.js';
import config from './config/env.config.js';

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);

    app.listen(config.port, () => {
      // No-op: startup logs removed to keep output clean in local/dev runs.
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();