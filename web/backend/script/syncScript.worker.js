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
import shopifyService from '../services/shopify.service.js';
import {
  prepareSingleFulfillmentServiceData,
  updateVariantsByFulFillmentServicesData,
} from '../utils/prepareFulFillmentServices.js';

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
  // DO NOT DELETE LOCATIONS EVERYTIME
  // FETCH FULLFILLMENT SERVICES
  // PUSH fullfillment services to Sanity

  // const deleteLocRes = await sanityService.init_deleteLocations();

  // if (deleteLocRes) {
  //   console.log('deleteLocRes: ', JSON.stringify(deleteLocRes));
  // }

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
  }

  let sanityLocationsData,
    updatedVariantsWithLocations,
    loadingResult = false;
  const fulfillmentServicesDataArr = [];

  if (fileUrl) {
    loadingResult = await downloadFile(fileUrl, filePath);
  }

  const data = loadingResult ? await getDataFromFile(filePath) : null;
  const fulfillmentServicesArr = await shopifyService.getFulfillmentServices({
    session,
  });

  console.log(
    'fulfillmentServicesArr: ',
    JSON.stringify(fulfillmentServicesArr)
  );

  for (let i = 0; i < fulfillmentServicesArr?.length; i += 1) {
    const singleFulfillment =
      await shopifyService.getInventoryLevelsByFulFillmentServiceId({
        session,
        fulfillment_service_id: `gid://shopify/FulfillmentService/${fulfillmentServicesArr?.[i]?.id}`,
      });

    if (singleFulfillment) {
      const preparedDataArr =
        prepareSingleFulfillmentServiceData(singleFulfillment);

      Array.isArray(preparedDataArr) &&
        fulfillmentServicesDataArr.push(...preparedDataArr);
    }
  }

  console.log(
    'fulfillmentServicesDataArr?.length: ',
    fulfillmentServicesDataArr?.length
  );

  if (data) {
    const deletedLocationsRes = await sanityService.init_deleteLocations();

    console.log('deletedLocationsRes', deletedLocationsRes);
    

    const locationsResult = await sanityService.init_createLocations(
      data?.locationsArr
    );
    const fulfillmentServicesLocationsResult =
      await sanityService.init_createLocations(fulfillmentServicesArr, true);

    sanityLocationsData = await sanityService.getLocations();

    updatedVariantsWithLocations = updateVariantsByFulFillmentServicesData(
      data?.variantsWithLocations,
      fulfillmentServicesDataArr
    );

    console.log(
      'updatedVariantsWithLocations?.length: ',
      updatedVariantsWithLocations?.length
    );

    const preparedSanityVariantsArr = mapSanityVariants(
      updatedVariantsWithLocations,
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
    '\n========================= INIT SCRIPT END ================================\n'
  );

  parentPort.postMessage({
    data: {
      variantsWithLocations: updatedVariantsWithLocations,
      locationsArr: sanityLocationsData?.map((item) => ({
        id: item?.id,
        name: item?.name,
        countryCode: item?.countryCode,
      })),
    },
  });
} catch (error) {
  console.log('initialSyncScript error: ', error);

  parentPort.postMessage({ data: null });
}
