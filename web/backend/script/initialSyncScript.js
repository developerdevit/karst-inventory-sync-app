import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const workerFilePath = path.resolve(__dirname, 'syncScript.worker.js');

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
