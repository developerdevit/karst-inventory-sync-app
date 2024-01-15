import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const DEFAULT_FETCH_DELAY = 1000; // in ms
export const MAX_RETRY_AMOUNT = 100; // MAX_RETRY_AMOUNT * DEFAULT_FETCH_DELAY = max time to wait for response

export const WEBHOOKS = [
  'INVENTORY_ITEMS_UPDATE',
  'INVENTORY_ITEMS_CREATE',
  'INVENTORY_ITEMS_DELETE',
  'LOCATIONS_UPDATE',
  'LOCATIONS_CREATE',
  'LOCATIONS_DELETE',
  'LOCATIONS_ACTIVATE',
  'LOCATIONS_DEACTIVATE',
];

export const STATIC_PATH =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '..', '..', '..', 'frontend/dist') //; `${process.cwd()}/frontend/dist`
    : path.resolve(__dirname, '..', '..', '..', 'frontend'); //`${process.cwd()}/frontend/`;

console.log('STATIC_PATH', process.env.NODE_ENV, STATIC_PATH);
