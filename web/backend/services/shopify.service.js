import shopify from "../config/shopify.js";
import {
  GET_CATALOGS_QUERY,
  GET_SINGLE_COMPANY_LOCATION_CATALOGS_QUERY,
  GET_COMPANY_LOCATIONS_WITH_CATALOGS_QUERY,
} from "../graphql/queries/catalogs.graphql.js";
import {
  GET_INVENTORY_ITEM_BY_ID,
  GET_INVENTORY_ITEM_WITH_LEVELS_BY_ID,
  GET_INVENTORY_LEVELS_BY_FULFILLMENT_SERVICE_ID,
} from "../graphql/queries/intentoryItems.graphql.js";
import { prepareFulFillmentServices } from "../utils/prepareFulFillmentServices.js";

// TODO:
// check if can receive location with FULLFILLMENT
// https://shop.karstgoods.com/admin/api/2024-01/fulfillment_services.json?scope=all

class ShopifyService {
  async getInventoryItemWithLevelsById({
    session,
    inventory_item_id,
    locations_count, // SET 10 - 20
  }) {
    try {
      const client = new shopify.api.clients.Graphql({ session });

      const res = await client.query({
        data: {
          query: GET_INVENTORY_ITEM_WITH_LEVELS_BY_ID,
          variables: {
            id: inventory_item_id,
            names: ["available"],
            inventoryLevelsCount: locations_count,
          },
        },
      });

      const productVariantId = res?.body?.data?.inventoryItem?.variant?.id;
      const nodes = res?.body?.data?.inventoryItem?.inventoryLevels?.nodes;

      return { productVariantId, nodes };
    } catch (error) {
      console.log(
        "shopifyService.getInventoryItemWithLevelsById error: ",
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
            "getProductVariantByInventoryItemId shopify query error: ",
            err
          )
        );

      return res?.body?.data?.inventoryItem?.variant?.id;
    } catch (error) {
      console.log(
        "shopifyService.getProductVariantByInventoryItemId error: ",
        error
      );
      return null;
    }
  }

  async getFulfillmentServices({ session }) {
    try {
      const client = new shopify.api.clients.Rest({
        session,
        apiVersion: "2024-01",
      });

      const res = await client.get({
        path: "fulfillment_services",
        query: { scope: "all" },
      });
      const data = prepareFulFillmentServices(res);

      console.log("getFulfillmentServices data", data);

      return data;
    } catch (error) {
      console.log("shopifyService.getFulfillmentServices error: ", error);
      return null;
    }
  }

  async getInventoryLevelsByFulFillmentServiceId({
    session,
    fulfillment_service_id,
  }) {
    try {
      const client = new shopify.api.clients.Graphql({ session });

      const res = await client.query({
        data: {
          query: GET_INVENTORY_LEVELS_BY_FULFILLMENT_SERVICE_ID,
          variables: {
            id: fulfillment_service_id,
            names: ["available"],
          },
        },
      });

      const location_id = res?.body?.data?.fulfillmentService?.location?.id;
      const nodes =
        res?.body?.data?.fulfillmentService?.location?.inventoryLevels?.edges;

      return { location_id, nodes };
    } catch (error) {
      console.log(
        "shopifyService.getInventoryLevelsByFulFillmentServiceId error: ",
        error
      );
      return null;
    }
  }

  async getCompanyLocationsCatalogs(session, company_location_id) {
    if (!company_location_id) {
      return { data: null, error: "company_location_id is required" };
    }

    try {
      const client = new shopify.api.clients.Graphql({ session });

      const res = await client.query({
        data: {
          query: GET_SINGLE_COMPANY_LOCATION_CATALOGS_QUERY,
          variables: {
            query: `company_location_id:${company_location_id}`,
          },
        },
      });

      console.log("getCompanyLocationsCatalogs res", res?.body?.data);

      return { data: res?.body?.data };
    } catch (error) {
      console.log("shopifyService.getCompanyLocationsCatalogs error: ", error);
      return { data: null, error };
    }
  }

  async getAllCatalogs({ session }) {
    try {
      const client = new shopify.api.clients.Graphql({ session });

      const res = await client.query({
        data: {
          query: GET_CATALOGS_QUERY,
        },
      });

      // console.log("getAllCatalogs res", res?.body?.data?.catalogs?.nodes);

      const companyLocationsCatalogs = res?.body?.data?.catalogs?.nodes?.filter(
        (catalog) => catalog?.__type?.toLowerCase() === "companylocationcatalog"
      );

      console.log("companyLocationsCatalogs", companyLocationsCatalogs);

      return { data: res?.body?.data };
    } catch (error) {
      console.log("shopifyService.getAllCatalogs error: ", error);
      return null;
    }
  }

  async getCompanyLocationsWithCatalogs({ session }) {
    try {
      const client = new shopify.api.clients.Graphql({ session });

      const res = await client.query({
        data: {
          query: GET_COMPANY_LOCATIONS_WITH_CATALOGS_QUERY,
        },
      });

      const companyLocations = res?.body?.data?.companyLocations?.nodes;

      return {
        data: companyLocations,
        meta: {
          warning: res?.body?.data?.companyLocations?.nodes?.some(
            (location) => location?.catalogs?.nodes?.length > 1
          )
            ? "Some locations have more than 1 catalog"
            : null,
        },
      };
    } catch (error) {
      console.log("shopifyService.getAllCatalogs error: ", error);
      return null;
    }
  }
}

const shopifyService = new ShopifyService();

export default shopifyService;
