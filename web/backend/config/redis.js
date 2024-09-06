import Redis from 'ioredis';
import pkg from 'bullmq';
import { RedisSessionStorage } from '@shopify/shopify-app-session-storage-redis';

import { REDIS_URL, REDIS_TLS_URL } from './vars/envs.js';
import { workerUpdateCallback } from '../worker/worker.js';
import logger from './logger.js';

const { Worker, Queue } = pkg;

let redisClient, sessionStorage;

console.log('REDIS_TLS_URL', REDIS_TLS_URL);
console.log('REDIS_URL', REDIS_URL);

try {
  // REDIS_TLS_URL
  // redisClient = new Redis(REDIS_TLS_URL ?? REDIS_URL, {
  //   maxRetriesPerRequest: null,
  //   tls: { rejectUnauthorized: false },
  // });

  sessionStorage = new RedisSessionStorage(`${REDIS_URL}`);
  // sessionStorage = {};
  console.log('sessionStorage', sessionStorage);
  
} catch (error) {
  logger.error('redis connection error: ' + error);
  console.log('redis connection error: ', error);
}

const updateInventoryLevelsWebhookQueue = null;
// new Queue(
//   'updateInventoryLevelsWebhookQueue',
//   {
//     redis: {
//       password: REDIS_URL.split('@')[0].split(':')[2],
//       host: REDIS_URL.split('@')[1].split(':')[0],
//       port: parseInt(REDIS_URL.split('@')[1].split(':')[1]),
//       tls: { rejectUnauthorized: false },
//     },
//   }
// );

const updateInventoryLevelsWorker = null;
// new Worker(
//   'updateInventoryLevelsWebhookQueue',
//   workerUpdateCallback,
//   {
//     connection: {
//       host: REDIS_URL.split('@')[1].split(':')[0],
//       port: parseInt(REDIS_URL.split('@')[1].split(':')[1]),
//     },
//   }
// );

export {
  updateInventoryLevelsWebhookQueue,
  updateInventoryLevelsWorker,
  // redisClient,
  sessionStorage,
};
