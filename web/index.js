import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import serveStatic from 'serve-static';

import shopify from './backend/config/shopify.js';
import { webhookHandlers } from './backend/webhooks/index.js';
import { PORT } from './backend/config/vars/envs.js';
import { STATIC_PATH } from './backend/config/vars/constants.js';
import { initialSyncScript } from './backend/script/initialSyncScript.js';
import sanityService from './backend/services/sanity.service.js';

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

app.get('/api/products/count', async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.post('/api/run-sync-script', async (_req, res) => {
  const session = res.locals.shopify.session;

  const result = await initialSyncScript(session);

  console.log('res', result);

  if (!result) {
    res.status(200).send({ success: false, data: null });
  }

  res.status(200).send({ success: true, data: result });
});

// TEST ENDPOINT
app.get('/api/test', async (_req, res) => {
  console.time('update_query');

  // TODO: remove HARDCODED params and replace into webhook INVENTORY_LEVELS_UPDATE
  const result =
    await sanityService.updateProductVariantByInventoryItemIdAndLocationIdAndQuantity(
      '46283008704768',
      '73318596864',
      1
    );

  console.log('res', JSON.stringify(result, null, 2));

  if (!result) {
    res.status(200).send({ success: false, data: null });
  }

  console.timeEnd('update_query');

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

app.use((err, req, res, next) => {
  const session = res?.locals?.shopify?.session;

  if (session) {
    console.error(err?.message + ' ' + JSON.stringify(session, null, 2));
  }

  console.error(err);
  res.status(err?.status || 500).json({ error: err?.message });
});

app.listen(PORT);
