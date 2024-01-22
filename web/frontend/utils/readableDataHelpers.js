function extractLocations(data) {
  if (data) {
    const locationsArr = data?.data?.locationsArr;

    const preparedLocations = locationsArr?.map(
      (el) => `🛍️  StockLocation: ${el.name} (${el.countryCode}) - ${el?.id}`
    );

    return preparedLocations;
  }

  return [];
}

function extractVariants(data) {
  if (data) {
    const variantsWithLocations = data?.data?.variantsWithLocations;
    const locationsArr = data?.data?.locationsArr;

    const preparedVariants = variantsWithLocations?.map((el) => {
      const locations = el?.locations?.map((loc) => {
        const curLoc = locationsArr?.find(
          (location) => location?.id === loc?.id
        );

        return `- 🛍️  ${curLoc?.name} (${curLoc?.countryCode}): ${loc?.quantity} available`;
      });

      return {
        title: `📰 ProductVariant: ${el?.variantName} (${el?.variantId}):`,
        locations: locations,
      };
    });

    return preparedVariants;
  }

  return [];
}

export { extractLocations, extractVariants };
