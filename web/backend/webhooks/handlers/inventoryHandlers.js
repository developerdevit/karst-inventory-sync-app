// import { updateInventoryLevelsWebhookQueue } from '../../config/redis.js';
import { QUEUE_SETTINGS } from '../../config/vars/constants.js';

export const inventoryUpdate = async (topic, shop, body) => {
  try {
    console.log('inventoryUpdate callback', shop, topic);
    console.log('inventoryUpdate body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('inventoryUpdate callback error:', e);
  }
};

export const inventoryCreate = async (topic, shop, body) => {
  try {
    console.log('inventoryItemsCreate callback', topic, shop);

    const parsedBody = JSON.parse(body);

    if ('id' in parsedBody) {
      // inventoryItemId
      const { id } = parsedBody;

      // await updateInventoryLevelsWebhookQueue.add(
      //   topic,
      //   {
      //     inventory_item_id: `gid://shopify/InventoryItem/${id}`,
      //     shop,
      //   },
      //   QUEUE_SETTINGS
      // );
    }
  } catch (e) {
    console.log('inventoryItemsCreate callback error:', e);
  }
};

export const inventoryDelete = async (topic, shop, body) => {
  try {
    console.log('inventoryDelete callback', topic);

    const parsedBody = JSON.parse(body);

    if ('id' in parsedBody) {
      // inventoryItemId
      const { id } = parsedBody;

      // await updateInventoryLevelsWebhookQueue.add(
      //   topic,
      //   {
      //     inventory_item_id: `gid://shopify/InventoryItem/${id}`,
      //     shop,
      //   },
      //   QUEUE_SETTINGS
      // );
    }
  } catch (e) {
    console.log('inventoryDelete callback error:', e);
  }
};

export const inventoryLevelsUpdate = async (topic, shop, body) => {
  try {
    console.log('inventoryLevelsUpdate callback', topic);

    const parsedBody = JSON.parse(body);

    if (
      'inventory_item_id' in parsedBody &&
      'location_id' in parsedBody &&
      'available' in parsedBody
    ) {
      const { inventory_item_id, location_id, available } = parsedBody;

      // await updateInventoryLevelsWebhookQueue
      //   .add(
      //     topic,
      //     {
      //       inventory_item_id,
      //       location_id,
      //       available,
      //       shop,
      //     },
      //     QUEUE_SETTINGS
      //   )
      //   .catch((err) =>
      //     console.log('updateInventoryLevelsWebhookQueue error: ', err)
      //   );
    }
  } catch (e) {
    console.log('inventoryLevelsUpdate callback error:', e);
  }
};
