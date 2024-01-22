export function prepareLocationsAndAvailable(data = []) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    const idIdx = item?.location?.id?.lastIndexOf('/');
    const location_id = item?.location?.id?.slice(idIdx + 1);

    return { location_id, available: item?.quantities?.[0]?.quantity };
  });
}
