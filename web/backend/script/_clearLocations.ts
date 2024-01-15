import path from 'path';

import sanityService from '../services/sanity.service';
import { getDataFromFile } from '../utils/getDataFromFile';
import { TSanityLocation, TVariantWithLocations } from '../typescript/types';
import { mapSanityVariants } from '../utils/mapSanityVariants';

const filePath = path.resolve(__dirname, 'data', 'data.jsonl');

async function main() {
  try {
    const data = await getDataFromFile(filePath);
    const sanityData: TSanityLocation[] = await sanityService.getLocations();

    if (data) {
      const preparedSanityVariantsArr = mapSanityVariants(
        data?.variantsWithLocations as TVariantWithLocations[],
        sanityData
      );

      for (const item of preparedSanityVariantsArr) {
        const res = await sanityService.init_deleteSingleVariantLocations(
          item.variantId
        );

        console.log('res', res);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

main();
