export function prepareFulFillmentServices(res) {
  if (
    res?.body?.fulfillment_services &&
    Array.isArray(res?.body?.fulfillment_services)
  ) {
    return res?.body?.fulfillment_services
      ?.filter((item) => item?.name !== 'test')
      ?.map((item) => ({
        name: item?.name,
        id: item?.id?.toString(),
        location_id: item?.location_id?.toString(),
        countryCode: 'null',
      }));
  }

  return [];
}

export function prepareSingleFulfillmentServiceData(data) {
  const locationIdStr = data?.fulfillmentService?.location?.id;
  const nodes = data?.fulfillmentService?.location?.inventoryLevels?.edges;

  console.log('locationIdStr', locationIdStr);

  const locationIdIdx = locationIdStr?.lastIndexOf('/');
  const locationId = locationIdStr?.slice(locationIdIdx + 1);

  const preparedVariantsWithLocation = nodes?.map((item) => {
    const variantIdStr = item?.node?.item?.variant?.id;
    const variantIdIdx = variantIdStr?.lastIndexOf('/');

    return {
      variantId: variantIdStr?.slice(variantIdIdx + 1),
      locationId,
      quantity: item?.node?.quantities?.[0]?.quantity,
    };
  });

  return preparedVariantsWithLocation;
}

export function updateVariantsByFulFillmentServicesData(
  variantsWithLocations,
  fulfillmentServicesData
) {
  return variantsWithLocations?.map((variant) => {
    const searchedFulfillmentServiceVariant = fulfillmentServicesData?.find(
      (item) => item?.variantId === variant?.variantId
    );

    if (searchedFulfillmentServiceVariant) {
      const hasFulfillmentServiceLocation = variant?.locations?.some(
        (location) =>
          location?.id === searchedFulfillmentServiceVariant?.locationId
      );

      if (!hasFulfillmentServiceLocation) {
        variant?.locations?.push({
          id: searchedFulfillmentServiceVariant?.locationId,
          quantity: searchedFulfillmentServiceVariant?.quantity,
        });
      }
    }

    return variant;
  });
}
