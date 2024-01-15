import sanityClient from '../config/sanity.js';
import { stockLocations } from '../config/vars/stockLocations.js';

class SanityService {
  // product && productVariants functions
  async getProducts() {
    try {
      const products = await sanityClient.fetch(
        `*[_type == "product" && store.status != 'draft']`
      );

      return products;
    } catch (error) {
      console.log('sanityService.getProducts error: ', error);
      return [];
    }
  }

  async getProductVariants() {
    try {
      const variants = await sanityClient.fetch(`*[_type == "productVariant"]`);

      return variants;
    } catch (error) {
      console.log('sanityService.getProductVariants error: ', error);
      return [];
    }
  }

  async getProductVariantByInventoryItemIdAndLocationId(
    inventoryItemId,
    locationId
  ) {
    try {
      const variant = await sanityClient.fetch(`
      *[_type == "productVariant" && inventoryItemId == "${inventoryItemId}" && "${locationId}" in locations[].location._ref][0]{
        store {
          gid,
        },
        inventoryItemId,
        "location": locations[] {
            "": location -> {
              name,
              countryCode,
              _id,
            },
              quantity,
        }[_id == "${locationId}"][0]
      }
      `);

      return variant;
    } catch (error) {
      console.log(
        'sanityService.getProductVariantByInventoryItemIdAndLocationId error: ',
        error
      );
      return [];
    }
  }

  async updateProductVariantByInventoryItemIdAndLocationIdAndQuantity(
    inventoryItemId,
    shopifyLocationId,
    quantity = 1
  ) {
    try {
      const sanityLocationObj = await this.getLocationByShopifyId(
        shopifyLocationId
      );

      if (!sanityLocationObj?._id) {
        console.warn(`Location with shopifyId ${shopifyLocationId} not found.`);
        return null;
      }

      const variant = await sanityClient.fetch(`
      *[_type == "productVariant" && inventoryItemId == "${inventoryItemId}" && "${sanityLocationObj?._id}" in locations[].location._ref][0]{
        _id,
        locations,
      }
      `);

      const _id = variant?._id;
      const locations = variant?.locations ?? [];

      const searchedLocationIdx = locations.findIndex(
        (item) => item?.location?._ref === sanityLocationObj?._id
      );

      if (searchedLocationIdx === -1) {
        return null;
      }

      const searchedLocation = locations?.[searchedLocationIdx];

      if (searchedLocation?.quantity < quantity) {
        console.warn(
          `Not enough amount for productVariant with _id "${_id}" and current quantity ${searchedLocation?.quantity}.`
        );
      }

      const result = await sanityClient
        .patch(_id)
        .insert('replace', `locations[${searchedLocationIdx}]`, [
          {
            ...searchedLocation,
            quantity: searchedLocation?.quantity - quantity,
          },
        ])
        .commit();

      // console.log('update result', JSON.stringify(result, null, 2));

      return result;
    } catch (error) {
      console.log(
        'sanityService.updateProductVariantByInventoryItemIdAndLocationIdAndQuantity error: ',
        error
      );
      return [];
    }
  }

  // location functions
  async getLocations() {
    try {
      return await sanityClient.fetch(`*[_type == "location"]`);
    } catch (error) {
      console.log('sanityService.getLocations error: ', error);
      return [];
    }
  }

  async getLocationByShopifyId(shopifyId) {
    try {
      return await sanityClient.fetch(
        `*[_type == "location" && id == "${shopifyId}"][0]`
      );
    } catch (error) {
      console.log('sanityService.getLocationByShopifyId error: ', error);
      return null;
    }
  }

  // init functions
  async init_updateSingleVariantWithLocations(_id, inventoryItemId, locations) {
    try {
      const res = await sanityClient
        .patch(_id)
        .setIfMissing({
          inventoryItemId,
          locations: [],
        })
        .append('locations', locations)
        .commit({ autoGenerateArrayKeys: true });

      return res;
    } catch (error) {
      console.log(
        'sanityService.init_updateSingleVariantWithLocations error: ',
        error?.message
      );
      return null;
    }
  }

  async init_deleteSingleVariantLocations(_id) {
    try {
      const res = await sanityClient
        .patch(_id)
        .setIfMissing({
          locations: [],
        })
        .set({
          locations: [],
        })
        .commit();

      return res;
    } catch (error) {
      console.log(
        'sanityService.init_deleteSingleVariantLocations error: ',
        error
      );
      return null;
    }
  }

  async init_createLocations(locationsArr) {
    try {
      const result = [];

      for (let i = 0; i < locationsArr?.length; i += 1) {
        const res = await sanityClient.create({
          ...locationsArr?.[i],
          stockCoverage: stockLocations?.[i]?.stockCoverage ?? [],
          _type: 'location',
        });

        if (res) {
          result.push(res);
        }
      }

      return result;
    } catch (error) {
      console.log('sanityService.init_createLocations error: ', error);
      return [];
    }
  }

  async init_deleteLocations() {
    try {
      const variants = await sanityClient.fetch(`*[_type == "productVariant"] {
        _id
      }`);

      for (const variant of variants) {
        if (variant?._id) {
          await this.init_deleteSingleVariantLocations(variant?._id);
        }
      }

      const res = await sanityClient.delete({
        query: `*[_type == "location"]`,
      });

      return res;
    } catch (error) {
      console.log('sanityService.init_deleteLocations error: ', error);
      return [];
    }
  }
}

const sanityService = new SanityService();

export default sanityService;
