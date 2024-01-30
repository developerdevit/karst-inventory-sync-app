export function prepareFulFillmentServices(res) {
  if (
    res?.body?.fulfillment_services &&
    Array.isArray(res?.body?.fulfillment_services)
  ) {
    return res?.body?.fulfillment_services?.map((item) => ({
      name: item?.name,
      id: item?.location_id,
      countryCode: '-null-',
    }));
  }

  return [];
}
