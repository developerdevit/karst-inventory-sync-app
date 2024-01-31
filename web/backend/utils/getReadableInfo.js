import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
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

function getUsedRAM() {
  return new Promise((resolve, reject) => {
    exec('free -m', (error, stdout) => {
      if (error) {
        console.error(`Error executing getUsedRAM: ${error}`);
        reject(null);
        return;
      }

      // Parse the output of the 'free -m' command
      const lines = stdout?.split('\n');
      const memoryInfo = lines?.[1]?.split(/\s+/);

      // Extract used RAM from the parsed output
      const usedRAM = parseInt(memoryInfo?.[2], 10);

      resolve(usedRAM ? `${usedRAM}M` : '???');
    });
  });
}

function getCPULoad() {
  return new Promise((resolve, reject) => {
    exec('mpstat 1 1', (error, stdout) => {
      if (error) {
        console.error(`Error executing getCPULoad: ${error}`);
        reject(null);
        return;
      }

      // Parse the output of the 'mpstat' command
      const lines = stdout?.split('\n');
      const cpuInfo = lines?.[lines?.length - 2]?.split(/\s+/);

      const cpuIdleStr = cpuInfo?.[11];

      const cpuIdle = cpuIdleStr?.includes(',')
        ? parseFloat(cpuIdleStr?.replace(',', '.'))
        : parseFloat(cpuIdleStr);

      resolve(cpuIdle ? (100 - cpuIdle).toFixed(2) : '???');
    });
  });
}

export async function getVPSStateData() {
  try {
    const ram = await getUsedRAM();
    const cpu = await getCPULoad();

    return { RAM: ram, CPU_load: cpu };
  } catch (error) {
    console.log(error);
    return null;
  }
}
