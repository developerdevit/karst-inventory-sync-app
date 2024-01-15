export function mapSanityVariants(
  variantsWithLocationsArr,
  sanityLocationsArr
) {
  const newArr = [...variantsWithLocationsArr];

  return newArr?.map((variant) => {
    const id = `shopifyProductVariant-${variant.variantId}`;
    const inventoryItemId = variant?.inventoryItemId;
    const newLocations = variant.locations?.map((location) => {
      const idx = sanityLocationsArr.findIndex((loc) => loc.id === location.id);

      if (idx !== -1) {
        return {
          location: {
            _ref: sanityLocationsArr[idx]._id,
            _type: 'location',
          },
          quantity: location.quantity,
          _type: 'locationItem',
        };
      }

      return {
        location: {
          _ref: null,
          _type: 'location',
        },
        quantity: location.quantity,
        _type: 'locationItem',
      };
    });

    return {
      variantId: id,
      inventoryItemId: inventoryItemId,
      locations: newLocations,
    };
  });
}
