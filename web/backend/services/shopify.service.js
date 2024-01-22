import shopify from '../config/shopify.js';
import {
  GET_INVENTORY_ITEM_BY_ID,
  GET_INVENTORY_ITEM_WITH_LEVELS_BY_ID,
} from '../graphql/queries/intentoryItems.graphql.js';

class ShopifyService {
  async getInventoryItemWithLevelsById({
    session,
    inventory_item_id,
    locations_count,
  }) {
    try {
      const client = new shopify.api.clients.Graphql({ session });

      const res = await client.query({
        data: {
          query: GET_INVENTORY_ITEM_WITH_LEVELS_BY_ID,
          variables: {
            id: inventory_item_id,
            names: ['available'],
            inventoryLevelsCount: locations_count,
          },
        },
      });

      const productVariantId = res?.body?.data?.inventoryItem?.variant?.id;
      const nodes = res?.body?.data?.inventoryItem?.inventoryLevels?.nodes;

      return { productVariantId, nodes };
    } catch (error) {
      console.log(
        'shopifyService.getInventoryItemWithLevelsById error: ',
        error
      );
      return null;
    }
  }

  async getProductVariantByInventoryItemId({ session, inventory_item_id }) {
    try {
      const client = new shopify.api.clients.Graphql({ session });

      const res = await client
        .query({
          data: {
            query: GET_INVENTORY_ITEM_BY_ID,
            variables: {
              id: `gid://shopify/InventoryItem/${inventory_item_id}`,
            },
          },
        })
        .catch((err) =>
          console.log(
            'getProductVariantByInventoryItemId shopify query error: ',
            err
          )
        );

      return res?.body?.data?.inventoryItem?.variant?.id;
    } catch (error) {
      console.log(
        'shopifyService.getProductVariantByInventoryItemId error: ',
        error
      );
      return null;
    }
  }
}

const shopifyService = new ShopifyService();

export default shopifyService;
