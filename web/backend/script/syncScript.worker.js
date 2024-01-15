import path from 'path';
import { fileURLToPath } from 'url';
import { parentPort } from 'worker_threads';

import shopify from '../config/shopify.js';
import sanityService from '../services/sanity.service.js';
import {
  createBulkOperation,
  fetchBulkOperationResult,
  sleep,
  downloadFile,
  getDataFromFile,
  deleteFileIfExist,
  mapSanityVariants,
} from '../utils/index.js';
import {
  DEFAULT_FETCH_DELAY,
  MAX_RETRY_AMOUNT,
} from '../config/vars/constants.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, 'data', 'data.jsonl');

console.log('Worker process started.');

const sessionStr = process.argv?.[process.argv?.length - 1];

if (!sessionStr) {
  throw Error('worker.js error: Session not provided');
}

const session = JSON.parse(sessionStr);

if (!session || !session?.shop) {
  throw Error('worker.js error: Session is not valid');
}

console.log(
  '\n========================= INIT SCRIPT START ================================\n'
);
try {
  let fileUrl = null,
    retryFetchAmount = 0;

  const client = new shopify.api.clients.Graphql({
    session,
  });

  await deleteFileIfExist(filePath);
  await sanityService.init_deleteLocations();

  const createdBulkOperationId = await createBulkOperation(client);

  if (createdBulkOperationId) {
    while (fileUrl === null) {
      fileUrl = await fetchBulkOperationResult(client);

      await sleep(DEFAULT_FETCH_DELAY);

      retryFetchAmount += 1;

      if (retryFetchAmount === MAX_RETRY_AMOUNT) {
        break;
      }
    }
  }

  if (!fileUrl && retryFetchAmount === MAX_RETRY_AMOUNT) {
    console.warn(
      `Can't get fileUrl from bulkOperation result with max retries ${MAX_RETRY_AMOUNT}`
    );
    parentPort.postMessage({ data: null });

    // return;
  }

  let loadingResult = false;

  if (fileUrl) {
    loadingResult = await downloadFile(fileUrl, filePath);
  }

  const data = loadingResult ? await getDataFromFile(filePath) : null;

  if (data) {
    const locationsResult =
      data?.locationsArr?.length > 0
        ? await sanityService.init_createLocations(data?.locationsArr)
        : null;

    if (!locationsResult) {
      console.warn('Locations not created');
      parentPort.postMessage({ data: null });
      // return;
    }

    const sanityLocationsData = await sanityService.getLocations();

    const preparedSanityVariantsArr = mapSanityVariants(
      data?.variantsWithLocations,
      sanityLocationsData
    );

    for (const item of preparedSanityVariantsArr) {
      await sanityService.init_updateSingleVariantWithLocations(
        item?.variantId,
        item?.inventoryItemId,
        item?.locations
      );
    }
  }

  console.log(
    'locationsWithVariants',
    JSON.stringify(data?.variantsWithLocations?.[0], null, 2)
  );

  console.log('\n=========================================================\n');

  console.log('locations', JSON.stringify(data?.locationsArr, null, 2));

  console.log(
    '\n========================= INIT SCRIPT END ================================\n'
  );

  parentPort.postMessage({ data });
} catch (error) {
  console.log('initialSyncScript error: ', error);

  parentPort.postMessage({ data: null });
}
