import Redis from 'ioredis';
import pkg from 'bullmq';
import { RedisSessionStorage } from '@shopify/shopify-app-session-storage-redis';

import { REDIS_URL } from './vars/envs.js';
import { workerUpdateCallback } from '../worker/worker.js';
import logger from './logger.js';

const { Worker, Queue, RedisConnection } = pkg;

let redisClient, sessionStorage, connection;

const host = REDIS_URL.split('@')[1].split(':')[0];
const port = parseInt(REDIS_URL.split('@')[1].split(':')[1]);
const password = REDIS_URL.split('@')[0].split(':')[2];

console.log('REDIS_URL', REDIS_URL, host, port, password);

try {
  // redisClient = await redis
  //   .createClient({
  //     url: REDIS_URL,
  //   })
  //   .on('error', (err) => console.log('Redis Client Error', err))
  //   .connect();
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: {
      rejectUnauthorized: false,
    },
  });

  sessionStorage = new RedisSessionStorage(`${REDIS_URL}/1`);

  // redis://:p90689d458616548983786890e0a1f59b390b6721ffee1024598818ffcdb60232@ec2-3-248-40-254.eu-west-1.compute.amazonaws.com:31459
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
