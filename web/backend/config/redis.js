import Redis from 'ioredis';
import pkg from 'bullmq';
import { RedisSessionStorage } from '@shopify/shopify-app-session-storage-redis';

import {
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USER,
} from './vars/envs.js';
import { workerUpdateCallback } from '../worker/worker.js';
import logger from './logger.js';

const { Worker, Queue, RedisConnection } = pkg;

let redisClient, connection, sessionStorage;

try {
  redisClient = new Redis(REDIS_PORT, REDIS_HOST, {
    maxRetriesPerRequest: null,
    password: REDIS_PASSWORD,
  });

  sessionStorage = new RedisSessionStorage(
    `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}/1`
  );

  connection = new RedisConnection(redisClient);
} catch (error) {
  logger.error('redis connection error: ' + error);
  console.log('redis connection error: ', error);
}

const updateInventoryLevelsWebhookQueue = new Queue(
  'updateInventoryLevelsWebhookQueue',
  {
    connection,
  }
);

const updateInventoryLevelsWorker = new Worker(
  'updateInventoryLevelsWebhookQueue',
  workerUpdateCallback,
  { connection, removeOnComplete: { count: 0 } }
);

export {
  updateInventoryLevelsWebhookQueue,
  updateInventoryLevelsWorker,
  redisClient,
  sessionStorage,
};

// const createInventoryItemsWorker = new Worker(
//   'createInventoryItemsWebhookQueue',
//   async (job) => {
//     // Process the job data
//     console.log(
//       'job.name',
//       job.name,
//       job?.name?.includes(WEBHOOKS_ENUM.INVENTORY_ITEMS_CREATE)
//     );
//     console.log('job.data', job.data);
//     console.log(
//       'WEBHOOKS_ENUM.INVENTORY_ITEMS_CREATE',
//       WEBHOOKS_ENUM.INVENTORY_ITEMS_CREATE
//     );

//     if (job?.name?.includes(WEBHOOKS_ENUM.INVENTORY_ITEMS_CREATE)) {
//       const shop = job?.data?.shop;
//       const inventory_item_id = job?.data?.inventory_item_id;

//       const locations_count = await sanityService.getLocationsCount();

//       const [session] = await sessionStorage
//         .findSessionsByShop(shop)
//         .catch((err) => console.log('findSessionsByShop error: ', err));

//       const shopifyResponseData =
//         await shopifyService.getInventoryItemWithLevelsById({
//           session,
//           inventory_item_id,
//           locations_count,
//         });

//       if (!shopifyResponseData) {
//         // TODO: handle error
//         return;
//       }

//       const { productVariantId, nodes } = shopifyResponseData;

//       const locationsAndAvailableArr = prepareLocationsAndAvailable(nodes);

//       console.log('locationsAndAvailableArr', locationsAndAvailableArr);

//       for (const obj of locationsAndAvailableArr) {
//         const result =
//           await sanityService.updateProductVariantByInventoryItemIdAndLocationIdAndQuantity(
//             {
//               inventory_item_id,
//               location_id: obj?.location_id,
//               available: obj?.available,
//             }
//           );

//         console.log('result', result);
//       }
//     }

//     return job.data;
//   },
//   { connection, removeOnComplete: { count: 0 } }
// );
