import { LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";

import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";

import { sessionStorage } from "./redis.js";
import {
  SCOPES,
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  HOST,
} from "./vars/envs.js";

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
    apiKey: SHOPIFY_API_KEY,
    apiSecretKey: SHOPIFY_API_SECRET,
    scopes: SCOPES?.split(",") || ["read_products"],
    hostName: HOST?.replace(/https?:\/\//, ""),
    hostScheme: "https",
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage,
  // sessionStorage: new MemorySessionStorage(),
});

export default shopify;
