import { open } from 'fs/promises';

import { getLocationObj } from './getLocationObj';
import { getVariantObj } from './getVariantObj';

export async function getLocationsWithVariantsFromFile(filePath) {
  try {
    const file = await open(filePath);

    const locationsWithVariants = [];

    const locationsArr = [];

    for await (const line of file.readLines()) {
      if (
        line.includes('shopify\\/Location\\/') &&
        !line.includes('__parentId')
      ) {
        const location = getLocationObj(line);

        if (location) {
          locationsArr.push(location);

          !locationsWithVariants.find(
            (item) => item.locationId === location.id
          ) &&
            locationsWithVariants.push({
              locationId: location.id,
              variants: [],
            });
        }
      }

      if (
        line.includes('shopify\\/Location\\/') &&
        line.includes('__parentId')
      ) {
        const obj = getVariantObj(line);

        if (obj) {
          const searchedLocationIdx = locationsWithVariants.findIndex(
            (item) => item.locationId === obj.locationId
          );

          if (searchedLocationIdx === -1) {
            locationsWithVariants.push({
              locationId: obj.locationId,
              variants: [obj.variant],
            });
          } else {
            locationsWithVariants[searchedLocationIdx].variants.push(
              obj.variant
            );
          }
        }
      }
    }

    return { locationsWithVariants, locationsArr };
  } catch (error) {
    console.log(error);
    return null;
  }
}
