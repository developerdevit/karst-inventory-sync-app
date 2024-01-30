export function prepareFulFillmentServices(res) {
  if (
    res?.body?.fulfillment_services &&
    Array.isArray(res?.body?.fulfillment_services)
  ) {
    return res?.body?.fulfillment_services
      ?.filter((item) => item?.name !== 'test')
      ?.map((item) => ({
        name: item?.name,
        id: item?.location_id?.toString(),
        countryCode: '-null-',
      }));
  }

  return [];
}
