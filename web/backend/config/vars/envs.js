import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT ?? 4000;
const HOST = process.env.HOST;

const SCOPES = process.env.SCOPES;

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET;
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;
const SANITY_API_VERSION = process.env.SANITY_API_VERSION;
const SHOPIFY_API_ACCESS_TOKEN = process.env.SHOPIFY_API_ACCESS_TOKEN;
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;

console.log('SANITY_DATASET', SANITY_DATASET);

//SHOPIFY_DOMAIN
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
};
