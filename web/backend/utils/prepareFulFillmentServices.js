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
  const locationIdStr = data?.location_id;
  const nodes = data?.nodes;

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
  const preparedFulfillmentServicesData = fulfillmentServicesData?.reduce(
    (acc, item) => {
      const searchedVariantIdx = acc?.findIndex(
        (cur) => cur?.variantId == item?.variantId
      );

      if (searchedVariantIdx !== -1) {
        acc[searchedVariantIdx].locations.push({
          id: item?.locationId,
          quantity: item?.quantity,
        });
      } else {
        acc.push({
          variantId: item?.variantId,
          locations: [{ id: item?.locationId, quantity: item?.quantity }],
        });
      }

      return acc;
    },
    []
  );

  return variantsWithLocations?.map((variant) => {
    const searchedFulfillmentServiceVariant =
      preparedFulfillmentServicesData?.find(
        (item) => item?.variantId === variant?.variantId
      );

    if (searchedFulfillmentServiceVariant) {
      searchedFulfillmentServiceVariant?.locations?.forEach(
        (searchedLocation) => {
          if (
            !variant?.locations?.some(
              (variantLocation) => variantLocation?.id === searchedLocation?.id
            )
          ) {
            variant?.locations.push({
              id: searchedLocation?.id,
              quantity: searchedLocation?.quantity,
            });
          }
        }
      );
    }

    return variant;
  });
}
