function extractLocations(response) {
  const success = response?.success;

  if (success) {
    const locationsArr = response?.data?.data?.locationsArr;

    const preparedLocations = locationsArr?.map(
      (el) => `🛍️  StockLocation: ${el.name} (${el.countryCode}) - ${el?.id}`
    );

    return preparedLocations;
  }

  return [];
}

function extractVariants(response) {
  const success = response?.success;

  if (success) {
    const variantsWithLocations = response?.data?.data?.variantsWithLocations;
    const locationsArr = response?.data?.data?.locationsArr;

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
