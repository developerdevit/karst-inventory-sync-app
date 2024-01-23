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
const SHOPIFY_API_ACCESS_TOKEN = process.env.SHOPIFY_API_ACCESS_TOKEN;
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;

const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost';
const REDIS_PORT = process.env.REDIS_PORT ?? 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? 'admin';
const REDIS_USER = process.env.REDIS_USER ?? 'default';
const REDIS_URL = process.env.REDIS_URL;

export {
  HOST,
  PORT,
  SCOPES,
  SANITY_API_TOKEN,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  SHOPIFY_API_ACCESS_TOKEN,
  SHOPIFY_DOMAIN,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_USER,
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  REDIS_URL,
};
