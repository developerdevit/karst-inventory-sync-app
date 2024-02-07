import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT ?? 4000;
const HOST = process.env.HOST;

const SCOPES = process.env.SCOPES;

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET;
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;
const SANITY_API_VERSION = process.env.SANITY_API_VERSION;

const REDIS_URL = process.env.REDIS_URL
  ? {
      password: process.env.REDIS_URL.split('@')[0].split(':')[2],
      host: process.env.REDIS_URL.split('@')[1].split(':')[0],
      port: parseInt(process.env.REDIS_URL.split('@')[1].split(':')[1]),
      tls: { rejectUnauthorized: false },
    }
  : 'redis://localhost:6379';

export {
  HOST,
  PORT,
  SCOPES,
  SANITY_API_TOKEN,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  REDIS_URL,
};
