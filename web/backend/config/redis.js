import Redis from 'ioredis';
import pkg from 'bullmq';
import { RedisSessionStorage } from '@shopify/shopify-app-session-storage-redis';

import { REDIS_URL } from './vars/envs.js';
import { workerUpdateCallback } from '../worker/worker.js';
import logger from './logger.js';

const { Worker, Queue, RedisConnection } = pkg;

let redisClient, connection, sessionStorage;

console.log('REDIS_URL', JSON.stringify(REDIS_URL, null, 2));

try {
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: {
      rejectUnauthorized: false,
    },
  });

  sessionStorage = new RedisSessionStorage(`${REDIS_URL}/1`);

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
