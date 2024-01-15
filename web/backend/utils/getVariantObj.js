export function getVariantObj(line, reversed = false) {
  try {
    const variantObj = JSON.parse(line);

    const variantIdStr = variantObj?.item?.variant?.id;
    const inventoryItemIdStr = variantObj?.item?.id;
    const name = variantObj?.item?.variant?.displayName;

    const locationIdStr = variantObj?.__parentId;
    const available = variantObj?.available;

    const variantIdIdx = variantIdStr?.lastIndexOf('/');
    const locationIdIdx = locationIdStr?.lastIndexOf('/');
    const inventoryItemIdIdx = inventoryItemIdStr?.lastIndexOf('/');

    if (variantIdIdx === -1 || locationIdIdx === -1) {
      return null;
    }

    const id = variantIdStr.slice(variantIdIdx + 1);
    const locationId = locationIdStr.slice(locationIdIdx + 1);
    const inventoryItemId = inventoryItemIdStr.slice(inventoryItemIdIdx + 1);

    if (reversed) {
      return {
        variantId: id,
        variantName: name,
        inventoryItemId,
        location: {
          id: locationId,
          quantity: available ?? 0,
        },
      };
    }

    return {
      locationId,
      variant: {
        id,
        name: variantName,
        inventoryItemId,
        quantity: available ?? 0,
      },
    };
  } catch (error) {
    console.log('getVariantObj parse error: ', error);
    return null;
  }
}
