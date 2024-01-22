import { sessionStorage } from '../config/redis.js';
import { WEBHOOKS_ENUM } from '../config/vars/constants.js';
import { extractIdFromStr } from '../utils/extractIdFromStr.js';
import sanityService from '../services/sanity.service.js';
import shopifyService from '../services/shopify.service.js';
import logger from '../config/logger.js';

async function workerUpdateCallback(job) {
  if (job?.name?.includes(WEBHOOKS_ENUM.INVENTORY_ITEMS_CREATE)) {
    console.info('START CREATE JOB');

    const shop = job?.data?.shop;
    const inventory_item_id = extractIdFromStr(job?.data, 'inventory_item_id');

    const [session] = await sessionStorage
      .findSessionsByShop(shop)
      .catch((err) => console.log('findSessionsByShop error: ', err));

    const productVariantId =
      await shopifyService.getProductVariantByInventoryItemId({
        session,
        inventory_item_id,
      });

    if (!productVariantId) {
      logger.error(
        `Job '${job?.name}' with data '${job?.data?.inventory_item_id}' failed: invalid productVariantId for inventory_item_id ${inventory_item_id}`
      );
      throw new Error({ message: 'Job failed' });
    }

    const updatedVariant = await sanityService.updateProductVariantById({
      id: productVariantId,
      inventory_item_id,
    });

    if (updatedVariant?.length === 0 || !updatedVariant) {
      logger.error(
        `Job '${job?.name}' with data '${job?.data?.inventory_item_id}' failed: invalid updatedVariant for productVariantId ${productVariantId}`
      );
      throw new Error({ message: 'Job failed' });
    }

    return updatedVariant;
  }

  if (job?.name?.includes(WEBHOOKS_ENUM.INVENTORY_LEVELS_UPDATE)) {
    console.info('START UPDATE JOB');

    const shop = job?.data?.shop;
    const inventory_item_id = job?.data?.inventory_item_id;

    const [session] = await sessionStorage
      .findSessionsByShop(shop)
      .catch((err) => console.log('findSessionsByShop error: ', err));

    const productVariantId =
      await shopifyService.getProductVariantByInventoryItemId({
        session,
        inventory_item_id,
      });

    if (!productVariantId) {
      logger.error(
        `Job '${job?.name}' with data '${job?.data?.inventory_item_id}' failed: invalid productVariantId for inventory_item_id ${inventory_item_id}`
      );
      throw new Error({ message: 'Job failed' });
    }

    const updatedVariant = await sanityService.updateProductVariantById({
      id: productVariantId,
      inventory_item_id,
    });

    if (updatedVariant?.length === 0 || !updatedVariant) {
      logger.error(
        `Job '${job?.name}' with data '${job?.data?.inventory_item_id}' failed: invalid updatedVariant for productVariantId ${productVariantId}`
      );

      throw new Error({ message: 'Job failed' });
    }

    const id = updatedVariant?.[0]?.store?.id;

    const updateResult =
      await sanityService.updateProductVariantByInventoryItemIdAndLocationIdAndQuantity(
        {
          productVariantId: id,
          location_id: job?.data?.location_id,
          available: job?.data?.available,
        }
      );

    if (!updateResult) {
      logger.error(
        `Job '${job?.name}' with data '${job?.data?.inventory_item_id}' failed: invalid updateResult for productVariantId ${productVariantId}`
      );

      throw new Error({ message: 'Job failed' });
    }

    return updateResult;
  }

  if (job?.name?.includes(WEBHOOKS_ENUM.INVENTORY_ITEMS_DELETE)) {
    console.info('DELETE JOB');

    const inventory_item_id = extractIdFromStr(job?.data, 'inventory_item_id');

    const deleteResult =
      await sanityService.deleteProductVariantByInventoryItemId({
        inventory_item_id,
      });

    return deleteResult;
  }
}

export { workerUpdateCallback };

// TEST RETRY ON FAILURE
// const randomFailure = Math.random() < 0.5;

// if (randomFailure) {
//   console.log('Random Job failed');
//   throw new Error(`Random Job failed`);
// }
