import path from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./config/shopify.js";
import { webhookHandlers } from "./webhooks/index.js";
import { PORT, HYDROGEN_SECRET, SHOP_DOMAIN } from "./config/vars/envs.js";
import { STATIC_PATH, __dirname } from "./config/vars/constants.js";
import { initialSyncScript } from "./script/initialSyncScript.js";
import { redisClient } from "./config/redis.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import {
  getListOfErrorLogsFiles,
  getRedisDbReadableInfo,
  getVPSStateData,
} from "./utils/getReadableInfo.js";
import shopifyService from "./services/shopify.service.js";
import sanityService from "./services/sanity.service.js";

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

app.get("/api/health-check", (_, res, next) => {
  try {
    return res.status(200).json({ message: "OK" });
  } catch (e) {
    next(e);
  }
});

app.get("/api/company_location_catalogs/:id", async (req, res) => {
  const authorizationHeader = req.headers?.authorization;
  const [bearer = null, secret = null] = authorizationHeader?.split(" ");

  if (bearer !== "Bearer" || secret !== HYDROGEN_SECRET) {
    return res
      .status(401)
      .send({ success: false, data: null, error: "Unauthorized" });
  }

  const company_location_id = req.params?.id;

  const offlineSessionId = shopify?.api?.session?.getOfflineId(SHOP_DOMAIN);

  const session = await shopify?.config?.sessionStorage?.loadSession(
    offlineSessionId
  );

  const response = await shopifyService.getCompanyLocationsCatalogs(
    session,
    company_location_id
  );

  if (!response.data) {
    const sanityData = await sanityService.getCompanyLocationCatalogsById(
      company_location_id
    );

    if (!sanityData) {
      return res
        .status(404)
        .send({ success: false, data: null, error: response?.error });
    }

    res.status(200).send({ success: true, data: sanityData });
  }

  res.status(200).json({
    success: true,
    data: response?.data,
  });
});

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.post("/api/run-sync-script", async (_req, res) => {
  const session = res.locals.shopify.session;

  const result = await initialSyncScript(session);

  if (!result) {
    res.status(404).send({ success: false, data: null });
  }

  res.status(200).send({ success: true, data: result });
});

app.get("/api/company_locations", async (_req, res) => {
  const session = res?.locals?.shopify?.session;

  if (!session) {
    return res.status(404).send({ success: false, data: null });
  }

  const result = await shopifyService.getCompanyLocationsWithCatalogs({
    session,
  });

  await sanityService.removeAllCompanyLocations();
  const sanityData = await sanityService.addCompanyLocations(result.data);

  console.log("sanityService.addCompanyLocations", sanityData);

  if (!sanityData?.success) {
    res
      .status(404)
      .send({ success: false, data: result, error: sanityData?.error });
  }

  res.status(200).send({ success: true, data: result });
});

app.delete("/api/company_locations", async (_req, res) => {
  const session = res?.locals?.shopify?.session;

  if (!session) {
    return res.status(404).send({ success: false, data: null });
  }

  const sanityData = await sanityService.removeAllCompanyLocations();

  console.log("sanityService.removeAllCompanyLocations", sanityData);

  if (!sanityData?.success) {
    res.status(404).send({ success: false, error: sanityData?.error });
  }

  res.status(200).send({ success: true, data: sanityData });
});

app.get("/api/info", async (_req, res) => {
  const redisInfo = await getRedisDbReadableInfo(redisClient);
  const files = await getListOfErrorLogsFiles();
  const serverState = await getVPSStateData();

  if (!redisInfo && !files) {
    res.status(404).send({ success: false, data: null });
  }

  res
    .status(200)
    .send({ success: true, data: { info: redisInfo, files, serverState } });
});

app.get("/api/test", async (_req, res) => {
  const session = res.locals.shopify.session;

  const data = await shopifyService.getFulfillmentServices({ session });

  const result =
    data?.length > 0
      ? await sanityService.init_createLocations(data, true)
      : [];

  console.log("sanityService.init_createLocations", result);

  if (!result) {
    res.status(404).send({ success: false, data: null });
  }

  res.status(200).send({ success: true, data: result });
});

// TODO: remove
app.delete("/api/remove-old-locations", async (_req, res) => {
  const result = await sanityService.init_deleteOldLocations();

  console.log("sanityService.init_deleteOldLocations", result);

  if (!result) {
    res.status(404).send({ success: false, data: null });
  }

  res.status(200).send({ success: true, data: result });
});

// TODO: add middleware to validate filename
app.get("/api/download-logs", (req, res) => {
  if (req?.query?.fileName && req?.query?.fileName?.includes(".log")) {
    const errorDirectoryPath = path.resolve(__dirname, "..", "..", "logs");
    const filePath = path.join(errorDirectoryPath, "/" + req?.query?.fileName);

    return res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Internal Server Error");
      }
    });
  }

  res
    .status(404)
    .send({ success: false, data: null, message: "File not found" });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  console.log("HERE ensureInstalledOnShop");
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(path.join(STATIC_PATH, "index.html")));
});

app.use(errorHandler);

app.listen(PORT, () => console.log("SERVER IS RUNNING!", PORT));
