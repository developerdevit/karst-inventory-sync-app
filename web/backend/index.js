import path from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import serveStatic from 'serve-static';

import shopify from './config/shopify.js';
import { webhookHandlers } from './webhooks/index.js';
import { PORT } from './config/vars/envs.js';
import { STATIC_PATH, __dirname } from './config/vars/constants.js';
import { initialSyncScript } from './script/initialSyncScript.js';
import { redisClient } from './config/redis.js';
import { errorHandler } from './middlewares/errorHandler.js';
import {
  getListOfErrorLogsFiles,
  getRedisDbReadableInfo,
} from './utils/getRedisDbReadableInfo.js';
import shopifyService from './services/shopify.service.js';

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

app.get('/api/info', async (_req, res) => {
  const info = await getRedisDbReadableInfo(redisClient);
  const files = await getListOfErrorLogsFiles();

  if (!info && !files) {
    res.status(404).send({ success: false, data: null });
  }

  res.status(200).send({ success: true, data: { info, files } });
});

app.get('/api/test', async (_req, res) => {
  const session = res.locals.shopify.session;

  const data = await shopifyService.getFulfillmentServices({ session });

  if (!data) {
    res.status(404).send({ success: false, data: null });
  }

  res.status(200).send({ success: true, data });
});

// TODO: add middleware to validate filename
app.get('/api/download-logs', (req, res) => {
  if (req?.query?.fileName && req?.query?.fileName?.includes('.log')) {
    const errorDirectoryPath = path.resolve(__dirname, '..', '..', 'logs');
    const filePath = path.join(errorDirectoryPath, '/' + req?.query?.fileName);

    return res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  }

  res
    .status(404)
    .send({ success: false, data: null, message: 'File not found' });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

// ,
app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  console.log('HERE ensureInstalledOnShop');
  return res
    .status(200)
    .set('Content-Type', 'text/html')
    .send(readFileSync(path.join(STATIC_PATH, 'index.html')));
});

app.use(errorHandler);

app.listen(PORT, () => console.log('SERVER IS RUNNING!', PORT));
