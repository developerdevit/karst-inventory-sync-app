import { updateInventoryLevelsWebhookQueue } from '../config/redis';
import sanityService from '../services/sanity.service.js';

async function removeLocations() {
  try {
    await sanityService.init_deleteOldLocations();
  } catch (error) {
    console.log(error);
  }
}

// async function getQueueLength() {
//   const counts = await updateInventoryLevelsWebhookQueue.getJobCounts();
//   const queueLength =
//     counts.waiting + counts.active + counts.completed + counts.failed;

//   console.log('Queue Length:', queueLength);
// }

// removeLocations();

// getQueueLength();
