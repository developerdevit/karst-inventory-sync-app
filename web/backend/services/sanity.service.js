import sanityClient from '../config/sanity.js';
import { stockLocations } from '../config/vars/stockLocations.js';

class SanityService {
  //#region product && productVariants functions
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

  async updateProductVariantByInventoryItemIdAndLocationIdAndQuantity({
    location_id,
    available = 1,
    productVariantId,
  }) {
    try {
      const sanityLocationObj = await this.getLocationByShopifyId(location_id);

      if (!sanityLocationObj?._id) {
        console.warn(`Location with shopifyId ${location_id} not found.`);
        return null;
      }

      const variant = await sanityClient.fetch(
        `*[_type == "productVariant" && store.id == ${productVariantId}][0]{
        _id,
        locations,
      }`
      );

      if (!variant?._id) {
        console.warn(`Variant with id ${productVariantId} not found.`);
        return null;
      }

      const locations = variant?.locations ?? [];

      const searchedLocationIdx = locations.findIndex(
        (item) => item?.location?._ref === sanityLocationObj?._id
      );

      if (searchedLocationIdx === -1) {
        return await sanityClient
          .patch(variant?._id)
          .insert('before', `locations[0]`, [
            {
              location: {
                _type: 'location',
                _ref: sanityLocationObj?._id,
              },
              quantity: available,
            },
          ])
          .commit({ autoGenerateArrayKeys: true });
      } else {
        return await sanityClient
          .patch(variant?._id)
          .insert('replace', `locations[${searchedLocationIdx}]`, [
            {
              location: {
                _type: 'location',
                _ref: sanityLocationObj?._id,
              },
              quantity: available,
            },
          ])
          .commit({ autoGenerateArrayKeys: true });
      }
    } catch (error) {
      console.log(
        'sanityService.updateProductVariantByInventoryItemIdAndLocationIdAndQuantity error: ',
        error
      );
      return [];
    }
  }

  async updateProductVariantById({ id, inventory_item_id }) {
    try {
      const result = await sanityClient
        .patch({
          query: `*[_type == "productVariant" && store.gid == "${id}"]`,
        })
        .set({
          inventoryItemId: inventory_item_id?.toString(),
        })
        .setIfMissing({
          locations: [],
        })
        .commit();

      return result;
    } catch (error) {
      console.log('sanityService.updateProductVariantById error: ', error);
      return null;
    }
  }

  async deleteProductVariantById({ id }) {
    try {
      const variant = await sanityClient.delete({
        query: `*[_type == "productVariant" && store.gid == "gid://shopify/ProductVariant/${id}"]`,
      });

      console.log('removed variant', variant);

      return variant;
    } catch (error) {
      console.log('sanityService.deleteProductVariantById error: ', error);
      return null;
    }
  }

  async deleteProductVariantByInventoryItemId({ inventory_item_id }) {
    try {
      const variant = await sanityClient.delete({
        query: `*[_type == "productVariant" && inventoryItemId == "${inventory_item_id}"]`,
      });

      console.log('removed variant', variant);

      return variant;
    } catch (error) {
      console.log(
        'sanityService.deleteProductVariantByInventoryItemId error: ',
        error
      );
      return null;
    }
  }
  //#endregion

  //#region location functions
  async getLocations() {
    try {
      return await sanityClient.fetch(`*[_type == "location"]`);
    } catch (error) {
      console.log('sanityService.getLocations error: ', error);
      return [];
    }
  }

  async getLocationsCount() {
    try {
      return await sanityClient.fetch(`count(*[_type == "location"])`);
    } catch (error) {
      console.log('sanityService.getLocationsCount error: ', error);
      return 0;
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
  //#endregion

  //#region init functions
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
        const curLocationName = locationsArr?.[i]?.name;

        console.log('curLocationName', curLocationName);

        const searchedLocation = stockLocations.find((loc) =>
          curLocationName?.toLowerCase()?.includes(loc.name.toLowerCase())
        );

        console.log('searchedLocation', searchedLocation);

        const res = await sanityClient.create({
          ...locationsArr?.[i],
          stockCoverage: searchedLocation?.stockCoverage ?? [],
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

      console.log('init_deleteLocations variants', variants);

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

  async init_deleteOldLocations() {
    try {
      const res = await sanityClient.delete({
        query: `*[_type == 'location' && dateTime(_createdAt) > dateTime('2024-01-27T20:43:31Z')]`,
      });

      return res;
    } catch (error) {
      console.log('sanityService.init_deleteOldLocations error: ', error);
      return [];
    }
  }

  // TODO: REMOVE or fix (hard-coded ids)
  async init_deleteLocationsByIds() {
    try {
      const res = await sanityClient.delete({
        query: `*[_type == 'location' && _id in ["r8QI4XsJMHUG6h19Hf7zcK", "r8QI4XsJMHUG6h19Hf7zPz", "r8QI4XsJMHUG6h19Hf7zDe"]]`,
      });

      return res;
    } catch (error) {
      console.log('sanityService.init_deleteLocationsByIds error: ', error);
      return [];
    }
  }
  //#endregion
}

const sanityService = new SanityService();

export default sanityService;
