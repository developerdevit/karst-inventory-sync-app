import { open } from 'fs/promises';

import { getVariantObj } from './getVariantObj.js';
import { getLocationObj } from './getLocationObj.js';

export async function getDataFromFile(filePath) {
  try {
    const file = await open(filePath);

    const locationsArr = [];
    const variantsWithLocations = [];

    for await (const line of file.readLines()) {
      if (
        line.includes('shopify\\/Location\\/') &&
        !line.includes('__parentId')
      ) {
        const location = getLocationObj(line);

        if (location) {
          locationsArr.push(location);
        }
      }

      if (
        line.includes('shopify\\/Location\\/') &&
        line.includes('__parentId')
      ) {
        const obj = getVariantObj(line, true);

        if (obj) {
          const searchedVariant = variantsWithLocations.findIndex(
            (item) => item.variantId === obj.variantId
          );

          searchedVariant !== -1
            ? variantsWithLocations[searchedVariant].locations.push(
                obj.location
              )
            : variantsWithLocations.push({
                variantId: obj.variantId,
                inventoryItemId: obj?.inventoryItemId,
                variantName: obj?.variantName,
                locations: [obj.location],
              });
        }
      }
    }

    return { locationsArr, variantsWithLocations };
  } catch (error) {
    console.log(error);
    return null;
  }
}
