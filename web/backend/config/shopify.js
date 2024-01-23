import { LATEST_API_VERSION } from '@shopify/shopify-api';
import { shopifyApp } from '@shopify/shopify-app-express';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-01';

import { sessionStorage } from './redis.js';
import { SCOPES, SHOPIFY_API_KEY, SHOPIFY_API_SECRET } from './vars/envs.js';

console.log('SHOPIFY_API_KEY', SHOPIFY_API_KEY, SHOPIFY_API_SECRET);

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
    apiKey: SHOPIFY_API_KEY,
    apiSecretKey: SHOPIFY_API_SECRET,
    scopes: SCOPES?.split(',') || ['read_products'],
    hostName: process.env.HOST?.replace(/https?:\/\//, ''),
    hostScheme: 'https',
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
  },
  webhooks: {
    path: '/api/webhooks',
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage,
});

export default shopify;
