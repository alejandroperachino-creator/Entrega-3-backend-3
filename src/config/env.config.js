import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_ENV = {
  PORT: '3000',
  MONGODB_URI: 'mongodb://localhost:27017/shipnow',
  NODE_ENV: 'development'
};

const env = {
  PORT: process.env.PORT ?? DEFAULT_ENV.PORT,
  MONGODB_URI: process.env.MONGODB_URI ?? DEFAULT_ENV.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV ?? DEFAULT_ENV.NODE_ENV
};

const parsedPort = Number(env.PORT);
if (Number.isNaN(parsedPort) || parsedPort <= 0) {
  throw new Error('PORT debe ser un numero positivo.');
}

const allowedNodeEnvs = ['development', 'test', 'production'];
if (!allowedNodeEnvs.includes(env.NODE_ENV)) {
  throw new Error(`NODE_ENV invalido. Valores permitidos: ${allowedNodeEnvs.join(', ')}.`);
}

const config = Object.freeze({
  port: parsedPort,
  mongoUri: env.MONGODB_URI,
  environment: env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET || ''
});

export default config;