import fs from 'fs';
import https from 'https';

export async function downloadFile(url, dest) {
  const file = fs.createWriteStream(dest);

  return new Promise((resolve, reject) =>
    https
      .get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
          console.info('Loading finished successfully!');
          file.close(); // close() is async, call cb after close completes.
          resolve(true);
        });
      })
      .on('error', function (err) {
        // Handle errors
        if (err) {
          console.error('Error on loading: ', err.message);
        }

        fs.unlink(dest, (error) => {
          if (error) {
            console.error('Error on deleting: ', error.message);
          }
          console.info('Deleted successfully!');
        });
        reject(false);
      })
  );
}
