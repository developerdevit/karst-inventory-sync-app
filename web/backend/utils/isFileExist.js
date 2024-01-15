import fs from 'fs/promises';

export async function isFileExist(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);

    return true;
  } catch (error) {
    // console.error(error);

    return false;
  }
}
