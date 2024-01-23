import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const DEFAULT_FETCH_DELAY = 1000; // in ms
export const MAX_RETRY_AMOUNT = 100; // MAX_RETRY_AMOUNT * DEFAULT_FETCH_DELAY = max time to wait for response

export const QUEUE_SETTINGS = {
  removeOnComplete: true,
  removeOnFail: 100,
  attempts: 50,
  backoff: {
    type: 'exponential',
    delay: 500,
  },
};

export const WEBHOOKS_ENUM = {
  INVENTORY_LEVELS_UPDATE: 'INVENTORY_LEVELS_UPDATE',
  INVENTORY_ITEMS_CREATE: 'INVENTORY_ITEMS_CREATE',
  INVENTORY_ITEMS_DELETE: 'INVENTORY_ITEMS_DELETE',
};

export const STATIC_PATH =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '..', '..', '..', 'frontend/dist') //; `${process.cwd()}/frontend/dist`
    : path.resolve(__dirname, '..', '..', '..', 'frontend'); //`${process.cwd()}/frontend/`;

console.log('STATIC_PATH', STATIC_PATH);
