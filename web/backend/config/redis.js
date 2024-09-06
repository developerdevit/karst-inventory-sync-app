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
  redisClient = new Redis(REDIS_TLS_URL, {
    maxRetriesPerRequest: null,
    tls: {
      rejectUnauthorized: false,
    },
  });

  sessionStorage = new RedisSessionStorage(`${REDIS_URL}/1`);
} catch (error) {
  logger.error('redis connection error: ' + error);
  console.log('redis connection error: ', error);
}

const updateInventoryLevelsWebhookQueue = new Queue(
  'updateInventoryLevelsWebhookQueue',
  {
    connection: redisClient,
  }
);

const updateInventoryLevelsWorker = new Worker(
  'updateInventoryLevelsWebhookQueue',
  workerUpdateCallback,
  { connection: redisClient, removeOnComplete: { count: 0 } }
);

export {
  updateInventoryLevelsWebhookQueue,
  updateInventoryLevelsWorker,
  redisClient,
  sessionStorage,
};
