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
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;
