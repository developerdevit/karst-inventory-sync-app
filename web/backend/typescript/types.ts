type TLocation = {
  name: string;
  id: string;
  address: {
    country: string;
    countryCode: string;
  };
};

type TInventoryLevel = {
  id: string;
};

export type TLocationsResponse = {
  data: {
    locations: {
      nodes: TLocation[];
    };
  };
};

export type TSingleLocationResponse = {
  data: {
    location: {
      id: string;
      inventoryLevels: {
        nodes: TInventoryLevel[];
      };
    };
  };
};

export type TBulkOperationRunResponse = {
  data: {
    BULK_OPERATION_RUN_QUERY: {
      bulkOperation: {
        id: string;
        status: string;
      };
      userErrors:
        | {
            field: string[];
            message: string;
          }[]
        | [];
    };
  };
};

export type TBulkOperationResultResponse = {
  data: {
    currentBulkOperation: {
      url: string;
    };
  };
};

export type TLocationsWithVariants = {
  locationId: string;
  variants: {
    id: string;
    quantity: number;
  }[];
};

export type TVariantWithLocations = {
  variantId: string;
  locations: {
    id: string;
    quantity: number;
  }[];
};

export type TLocations = {
  id: string;
  name: string | null;
  countryCode: string | null;
};

export type TSanityLocation = {
  _rev: string;
  _type: string;
  name: string;
  _id: string;
  id: string;
  countryCode: string;
};

export type TSanityPatchLocationObj = {
  location: {
    _ref: string;
    _type: string;
  };
  quantity: number;
  _type: string;
};
