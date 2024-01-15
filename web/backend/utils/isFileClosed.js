import fs from 'fs';

export function isFileClosed(filePath) {
  try {
    // Attempt to open the file in append mode without throwing an error
    fs.openSync(filePath, 'a');
    return true; // File can be opened, so it's closed
  } catch (err) {
    return err.code === 'EBUSY'; // 'EBUSY' means the file is still open
  }
}
