import fs from 'fs/promises';

export async function deleteFileIfExist(filePath) {
  await fs
    .access(filePath, fs.constants.F_OK)
    .then(() => {
      return fs.unlink(filePath);
    })
    .then(() => {
      console.log('File deleted successfully');
    })
    .catch((err) => {
      if (err.code === 'ENOENT') {
        console.log('File does not exist');
      } else {
        console.error(`Error deleting file: ${err}`);
      }
    });
}
