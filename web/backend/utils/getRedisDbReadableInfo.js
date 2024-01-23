import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const errorDirectoryPath = path.resolve(__dirname, '..', 'logs');

export async function getRedisDbReadableInfo(redisClient) {
  try {
    const redisInfo = await redisClient.info();

    const fieldsToExtract = [
      'used_memory_human',
      'used_memory_peak_human',
      'total_system_memory_human',
      'total_connections_received',
      'total_commands_processed',
      'db0',
      'db1',
    ];

    const pattern = new RegExp(`(${fieldsToExtract.join('|')}):([^\\s]+)`, 'g');
    const matches = {};

    let match;
    while ((match = pattern.exec(redisInfo)) !== null) {
      const field = match[1];
      const value = match[2];
      matches[field] = value;
    }

    return JSON.stringify(matches, null, 2);
  } catch (error) {
    console.error('Error getting Redis database info:', error);
  }
}

export async function getListOfErrorLogsFiles() {
  return new Promise((resolve, reject) =>
    fs.readdir(errorDirectoryPath, (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        reject(null);
        return;
      }

      resolve(files);
    })
  );
}
