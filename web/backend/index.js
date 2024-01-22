import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import serveStatic from 'serve-static';

import shopify from './config/shopify.js';
import { webhookHandlers } from './webhooks/index.js';
import { PORT } from './config/vars/envs.js';
import { STATIC_PATH } from './config/vars/constants.js';
import { initialSyncScript } from './script/initialSyncScript.js';
import sanityService from './services/sanity.service.js';
import { redisClient } from './config/redis.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { getRedisDbReadableInfo } from './utils/getRedisDbReadableInfo.js';

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers })
);

app.get('/api/health-check', (_, res, next) => {
  try {
    return res.status(200).json({ message: 'OK' });
  } catch (e) {
    next(e);
  }
});

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use('/api/*', shopify.validateAuthenticatedSession());

app.use(express.json());

app.post('/api/run-sync-script', async (_req, res) => {
  const session = res.locals.shopify.session;

  const result = await initialSyncScript(session);

  if (!result) {
    res.status(404).send({ success: false, data: null });
  }

  res.status(200).send({ success: true, data: result });
});

// REMOVE
// TEST ENDPOINT
app.get('/api/test', async (_req, res) => {
  res.status(200).send({ success: true, message: 'Hello', data: {} });
});

app.get('/api/info', async (_req, res) => {
  const result = await getRedisDbReadableInfo(redisClient);

  if (!result) {
    res.status(404).send({ success: false, data: null });
  }

  res.status(200).send({ success: true, data: result });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set('Content-Type', 'text/html')
    .send(readFileSync(join(STATIC_PATH, 'index.html')));
});

app.use(errorHandler);

app.listen(PORT);
