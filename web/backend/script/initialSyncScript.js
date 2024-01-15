import path from 'path';
import { fileURLToPath } from 'url';
import { parentPort, Worker } from 'worker_threads';
import { spawn } from 'child_process';

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
const workerFilePath = path.resolve(__dirname, 'syncScript.worker.js');

// export async function initialSyncScript(session) {
//   console.log(
//     '\n========================= INIT SCRIPT START ================================\n'
//   );
//   try {
//     let fileUrl = null,
//       retryFetchAmount = 0;

//     const client = new shopify.api.clients.Graphql({
//       session,
//     });

//     await deleteFileIfExist(filePath);
//     await sanityService.init_deleteLocations();

//     const createdBulkOperationId = await createBulkOperation(client);

//     if (createdBulkOperationId) {
//       while (fileUrl === null) {
//         fileUrl = await fetchBulkOperationResult(client);

//         await sleep(DEFAULT_FETCH_DELAY);

//         retryFetchAmount += 1;

//         if (retryFetchAmount === MAX_RETRY_AMOUNT) {
//           break;
//         }
//       }
//     }

//     if (!fileUrl && retryFetchAmount === MAX_RETRY_AMOUNT) {
//       console.warn(
//         `Can't get fileUrl from bulkOperation result with max retries ${MAX_RETRY_AMOUNT}`
//       );
//       return;
//     }

//     let loadingResult = false;

//     if (fileUrl) {
//       loadingResult = await downloadFile(fileUrl, filePath);
//     }

//     const data = loadingResult ? await getDataFromFile(filePath) : null;

//     if (data) {
//       const locationsResult =
//         data?.locationsArr?.length > 0
//           ? await sanityService.init_createLocations(data?.locationsArr)
//           : null;

//       if (!locationsResult) {
//         console.warn('Locations not created');
//         return;
//       }

//       const sanityLocationsData = await sanityService.getLocations();

//       const preparedSanityVariantsArr = mapSanityVariants(
//         data?.variantsWithLocations,
//         sanityLocationsData
//       );

//       for (const item of preparedSanityVariantsArr) {
//         await sanityService.init_updateSingleVariantWithLocations(
//           item.variantId,
//           item.locations
//         );
//       }
//     }

//     console.log(
//       'locationsWithVariants',
//       JSON.stringify(data?.variantsWithLocations?.[0], null, 2)
//     );

//     console.log(
//       '\n=========================================================\n'
//     );

//     console.log('locations', JSON.stringify(data?.locationsArr, null, 2));

//     console.log(
//       '\n========================= INIT SCRIPT END ================================\n'
//     );
//   } catch (error) {
//     console.log('initialSyncScript error: ', error);
//   }
// }

export async function initialSyncScript(session) {
  return new Promise((resolve, reject) => {
    console.log('runWorker start');

    try {
      const worker = new Worker(workerFilePath, {
        argv: [JSON.stringify(session)],
      });

      worker.on('message', (data) => {
        resolve(data);
      });

      worker.on('error', (err) => {
        console.log(err);
        reject(null);
      });
    } catch (error) {
      console.log('initialSyncScript error: ', error);
      reject(null);
    }
  });
}
