import { DeliveryMethod } from '@shopify/shopify-api';

import shopify from '../config/shopify.js';

import {
  uninstallApp,
  inventoryUpdate,
  inventoryLevelsUpdate,
  inventoryCreate,
  inventoryDelete,
  locationsActivate,
  locationsCreate,
  locationsDeactivate,
  locationsDelete,
  locationsUpdate,
} from './handlers/index.js';

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: uninstallApp,
  },
  // INVENTORY WEBHOOKS
  INVENTORY_ITEMS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: inventoryUpdate,
  },
  INVENTORY_LEVELS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: inventoryLevelsUpdate,
  },
  INVENTORY_ITEMS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: inventoryCreate,
  },
  INVENTORY_ITEMS_DELETE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: inventoryDelete,
  },
  // LOCATIONS WEBHOOKS
  LOCATIONS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: locationsUpdate,
  },
  LOCATIONS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: locationsCreate,
  },
  LOCATIONS_DELETE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: locationsDelete,
  },
  LOCATIONS_ACTIVATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: locationsActivate,
  },
  LOCATIONS_DEACTIVATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: locationsDeactivate,
  },
};
